# Tauri App Scaffold

## Usage
```bash
saturday new tauri-app my-desktop-app
```

## Structure
```
my-desktop-app/
├── src/               → React frontend (same as web)
│   ├── app/
│   │   └── page.tsx
│   └── components/
├── src-tauri/
│   ├── src/main.rs   → Tauri commands + app setup
│   ├── Cargo.toml    → Rust dependencies
│   └── tauri.conf.json → App config, permissions
├── .github/workflows/
│   └── tauri-release.yml  → Cross-platform build (NOT on VPS)
└── package.json
```

## Dependencies
```json
{
  "@tauri-apps/api": "^2.0.0",
  "@tauri-apps/plugin-fs": "^2.0.0",
  "@tauri-apps/plugin-shell": "^2.0.0"
}
```

## Key Files

### src-tauri/src/main.rs
```rust
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
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### src-tauri/Cargo.toml
```toml
[package]
name = "app"
version = "0.1.0"
edition = "2021"

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-fs = "2"
tauri-plugin-shell = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### src-tauri/tauri.conf.json
```json
{
  "productName": "My App",
  "version": "0.1.0",
  "identifier": "com.saturday.app",
  "build": {
    "frontendDist": "../out"
  },
  "app": {
    "withGlobalTauri": true
  },
  "bundle": {
    "active": true,
    "targets": "all"
  }
}
```

## Build Commands
```bash
# Dev
cargo tauri dev

# Build (on GitHub Actions, NOT VPS)
cargo tauri build --target x86_64-unknown-linux-gnu
```

## Deployment
- Build via GitHub Actions (7GB RAM runners)
- Release to GitHub Releases
- Supports Linux, Windows, macOS
