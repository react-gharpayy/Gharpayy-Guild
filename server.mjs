import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

function getPort() {
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "-p" || arg === "--port") {
      const value = Number(args[index + 1]);
      if (Number.isFinite(value) && value > 0) return value;
    }
    if (arg.startsWith("--port=")) {
      const value = Number(arg.slice("--port=".length));
      if (Number.isFinite(value) && value > 0) return value;
    }
  }

  const envPort = Number(process.env.PORT);
  if (Number.isFinite(envPort) && envPort > 0) return envPort;

  return 3003;
}

const port = getPort();
const distDir = resolve("dist");
const clientDir = join(distDir, "client");
const serverEntryPath = join(distDir, "server", "index.js");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function toWebHeaders(headers) {
  const webHeaders = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      webHeaders.set(name, value.join(", "));
    } else if (value != null) {
      webHeaders.set(name, String(value));
    }
  }
  return webHeaders;
}

function getContentType(filePath) {
  return contentTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";
}

async function loadServerHandler() {
  const serverEntryUrl = pathToFileURL(serverEntryPath).href;
  const serverModule = await import(serverEntryUrl);
  const handler = serverModule.default;

  if (typeof handler === "function") {
    return handler;
  }

  if (handler && typeof handler.fetch === "function") {
    return (request) => handler.fetch(request, {}, {});
  }

  throw new Error(`Unable to load request handler from ${serverEntryPath}. Run \"npm run build\" first.`);
}

async function serveStatic(pathname) {
  const filePath = resolve(clientDir, `.${pathname}`);
  if (!filePath.startsWith(clientDir)) {
    return null;
  }

  try {
    const body = await readFile(filePath);
    return new Response(body, {
      headers: {
        "content-type": getContentType(filePath),
        "cache-control": filePath.includes("/assets/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return null;
  }
}

async function sendNodeResponse(nodeResponse, res) {
  res.writeHead(nodeResponse.status, Object.fromEntries(nodeResponse.headers));
  if (!nodeResponse.body) {
    res.end();
    return;
  }

  const buffer = Buffer.from(await nodeResponse.arrayBuffer());
  res.end(buffer);
}

async function main() {
  const handler = await loadServerHandler();

  const server = http.createServer(async (req, res) => {
    try {
      if (!req.url || !req.method) {
        res.statusCode = 400;
        res.end("Bad Request");
        return;
      }

      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const hasFileExtension = extname(url.pathname) !== "";

      if (url.pathname.startsWith("/assets/") || url.pathname === "/favicon.ico" || hasFileExtension) {
        const staticResponse = await serveStatic(url.pathname);
        if (staticResponse) {
          await sendNodeResponse(staticResponse, res);
          return;
        }
      }

      const request = new Request(url, {
        method: req.method,
        headers: toWebHeaders(req.headers),
      });

      const response = await handler(request);
      await sendNodeResponse(response, res);
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end("Internal Server Error");
    }
  });

  server.listen(port, () => {
    console.log(`Production server running on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});