# Tauri Expert SKILL

## When to Use This Skill
Use when building desktop applications with Tauri (Rust backend + React frontend).

## Core Knowledge

### Setup
```bash
# Prerequisites (install on VPS)
sudo apt install -y libwebkit2gtk-4.1-dev libxdo-dev libssl-dev \
  libayatana-appindicator3-dev librsvg2-dev

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env

# Install Tauri CLI
cargo install tauri-cli

# New project
npm create tauri-app@latest my-app
```

### Architecture
```
my-app/
├── src/               → React frontend (same as web)
├── src-tauri/
│   ├── src/main.rs   → Tauri commands + app setup
│   ├── Cargo.toml    → Rust dependencies
│   └── tauri.conf.json → App config, permissions
└── package.json
```

### Rust Commands
```rust
// src-tauri/src/main.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Frontend Invocation
```typescript
import { invoke } from "@tauri-apps/api/async";

const result = await invoke("greet", { name: "World" });
const content = await invoke("read_file", { path: "/tmp/file.txt" });
```

### Build via GitHub Actions (NOT on VPS)
```yaml
# .github/workflows/tauri-release.yml
name: Tauri Release
on:
  push:
    tags: ["v*"]

jobs:
  build-tauri:
    strategy:
      matrix:
        include:
          - os: ubuntu-latest
            target: x86_64-unknown-linux-gnu
          - os: windows-latest
            target: x86_64-pc-windows-msvc
          - os: macos-latest
            target: x86_64-apple-darwin
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - uses: dtolnay/rust-toolchain@stable
      - name: Install Linux deps
        if: matrix.os == "ubuntu-latest"
        run: sudo apt install -y libwebkit2gtk-4.1-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: "Release ${{ github.ref_name }}"
          args: --target ${{ matrix.target }}
```

## Common Pitfalls
1. **Building on VPS** — Always use GitHub Actions (7GB RAM)
2. **Missing system deps** — Install webkit2gtk, ssl, etc.
3. **Not configuring permissions** — Set in tauri.conf.json
4. **Large bundle size** — Use `tauri build --debug` for testing

## Verification Checklist
- [ ] `cargo tauri dev` runs locally
- [ ] Rust commands callable from frontend
- [ ] GitHub Actions build succeeds
- [ ] App installs and runs on target OS
