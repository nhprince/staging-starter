# Electron Expert SKILL

## When to Use This Skill
Use when building desktop apps with Electron (larger bundle but biggest ecosystem).

## Core Knowledge

### Architecture
- Main process (Node.js) + Renderer process (React)
- IPC: `ipcMain.handle()` / `ipcRenderer.invoke()`

### Main Process
```typescript
// main.ts
import { app, BrowserWindow, ipcMain } from "electron";

ipcMain.handle("read-file", async (_, path: string) => {
  return await fs.readFile(path, "utf-8");
});

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  win.loadURL("http://localhost:3000");
});
```

### IPC Pattern
```typescript
// preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  readFile: (path) => ipcRenderer.invoke("read-file", path),
});

// Renderer
const content = await window.api.readFile("/tmp/file.txt");
```

### Packaging
```bash
npm install electron-builder --save-dev
npx electron-builder --linux --windows --mac
```

### Build via GitHub Actions (NOT VPS)
```yaml
- uses: samuelmeuli/action-electron-builder@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    release: true
```

## Common Pitfalls
1. **Large bundle** — ~150-200MB per platform
2. **Security** — Never enable nodeIntegration in renderer
3. **Memory usage** — Each window is a separate Chromium process

## Verification Checklist
- [ ] Main process starts without errors
- [ ] IPC communication works
- [ ] App packages for all target platforms
- [ ] Auto-updater configured
