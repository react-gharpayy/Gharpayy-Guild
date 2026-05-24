# gg

This app now has a simple VPS deployment path using a plain Node production server.

## Development

```bash
npm install
npm run dev
```

## Production on a VPS

```bash
npm install
npm run build
npm start
```

## PM2

```bash
pm2 start server.mjs --name gg -- -p 3003
```

## Notes

- `npm run preview` uses the same production server as `npm start`.
- The build still keeps the TanStack/Cloudflare-related project files, but they are no longer required for the VPS runtime path.