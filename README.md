# Geminicli Addon Manager

[English](#english) | [繁體中文](#繁體中文)

---

## English

A Text-based User Interface (TUI) tool for managing [Geminicli](https://github.com/google/geminicli) extensions and MCP (Model Context Protocol) servers.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

### Features

- 🎯 **Extension Management**: Enable/disable Geminicli extensions
- 🔌 **Extension-based MCP Server Management**: Control MCP servers within extensions
- 🌐 **Standalone MCP Server Management**: Manage standalone MCP servers from `settings.json`
- 🎨 **Interactive TUI**: Easy-to-use terminal interface with keyboard navigation
- 💾 **Auto-backup**: Automatically backs up configuration files before saving
- ⚡ **Fast & Lightweight**: Built with React Ink for smooth terminal rendering

### Screenshots

```
Geminicli Extension & MCP Server Manager

> [x] chrome-devtools-mcp
    [x] chrome-devtools (MCP Server)
  [ ] github
    [x] github (MCP Server)

--- Standalone MCP Servers ---
  [x] zen (Standalone)
  [ ] pointer (Standalone)
  [ ] context7 (Standalone)

Ready. Use arrow keys to navigate, Space to toggle, Enter to save & exit.
```

### Installation

#### Prerequisites

- Node.js >= 18.0.0
- [Geminicli](https://github.com/google/geminicli) installed and configured

#### Install from npm (Recommended)

```bash
npm install -g geminicli-addon-manage
```

#### Install from source

```bash
git clone https://github.com/yourusername/geminicli-addon-manage.git
cd geminicli-addon-manage
npm install
npm link
```

### Usage

#### Run the TUI

```bash
geminicli-manage-addon
```

#### Keyboard Controls

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate through items |
| `Space` | Toggle enable/disable |
| `Enter` | Save changes and exit |
| `Esc` | Exit without saving |

#### Integration with Geminicli

You can also run this tool directly from Geminicli using the `/manage-addon` slash command:

1. Create `~/.gemini/commands/manage-addon.toml`:

```toml
description = "Manage extensions and MCP servers"

prompt = """
I will launch the Geminicli Addon Manager TUI tool for you.

IMPORTANT INSTRUCTIONS:
1. Use Ctrl+C to interact with the TUI tool (arrow keys, space, enter)
2. After making changes, you MUST restart Gemini CLI for the new settings to take effect

Running the tool now...

Execute: `geminicli-manage-addon`

After you finish:
- Press Enter to save and exit
- Press Esc to exit without saving
- Then restart Gemini CLI to apply the changes
"""
```

2. In Geminicli, type:

```
/manage-addon
```

3. **Important**: Press `Ctrl+C` to interact with the TUI

4. **After making changes**: Restart Gemini CLI to apply the new settings

### Configuration Files

This tool manages the following configuration files:

| File | Purpose |
|------|---------|
| `~/.gemini/extensions/extension-enablement.json` | Extension enable/disable states |
| `~/.gemini/extensions/mcp-server-enablement.json` | Extension-based MCP server states |
| `~/.gemini/settings.json` | Standalone MCP server states (via `mcp.excluded`) |

All files are automatically backed up with a `.bak` extension before saving.

### How It Works

#### Extension Management

Extensions are enabled/disabled by modifying the `overrides` array in `extension-enablement.json`:

- Enabled: `["/Users/username/*"]`
- Disabled: `["!/Users/username/*"]`

#### Extension-based MCP Servers

MCP servers within extensions are managed via `mcp-server-enablement.json`:

```json
{
  "github": {
    "github": true
  },
  "chrome-devtools-mcp": {
    "chrome-devtools": false
  }
}
```

#### Standalone MCP Servers

Standalone MCP servers (defined in `settings.json`) are managed via the `mcp.excluded` array:

```json
{
  "mcp": {
    "excluded": ["pointer", "context7", "deepwiki"]
  }
}
```

### Development

#### Setup

```bash
git clone https://github.com/yourusername/geminicli-addon-manage.git
cd geminicli-addon-manage
npm install
```

#### Run locally

```bash
npm start
```

#### Project Structure

```
geminicli-addon-manage/
├── index.js          # Entry point
├── ui.js             # TUI logic and components
├── package.json      # Project configuration
└── README.md         # This file
```

### Technical Details

- **Framework**: [Ink](https://github.com/vadimdemedes/ink) - React for CLIs
- **Language**: ES6 Modules (Node.js)
- **Compatibility**: Node.js v18+ (tested on v25.2.1)
- **No JSX**: Uses `React.createElement` for maximum compatibility

### Troubleshooting

#### Command not found

If `geminicli-manage-addon` is not found after installation:

1. Check npm global bin directory:
   ```bash
   npm config get prefix
   ```

2. Ensure the bin directory is in your PATH:
   ```bash
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

#### Permission errors

If you encounter permission errors when saving:

```bash
# Check file permissions
ls -la ~/.gemini/extensions/extension-enablement.json
ls -la ~/.gemini/settings.json

# Fix if needed
chmod 644 ~/.gemini/extensions/extension-enablement.json
chmod 644 ~/.gemini/settings.json
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Built for [Geminicli](https://github.com/google/geminicli)
- Powered by [Ink](https://github.com/vadimdemedes/ink)
- Inspired by the need for easier Geminicli configuration management

### Support

If you encounter any issues or have questions:

- 🐛 [Report a bug](https://github.com/yourusername/geminicli-addon-manage/issues)
- 💡 [Request a feature](https://github.com/yourusername/geminicli-addon-manage/issues)
- 📖 [Read the documentation](https://github.com/yourusername/geminicli-addon-manage#readme)

### Changelog

#### v1.0.0 (2025-11-30)

- ✨ Initial release
- ✅ Extension management
- ✅ Extension-based MCP server management
- ✅ Standalone MCP server management
- ✅ Interactive TUI with keyboard navigation
- ✅ Auto-backup functionality

---

## 繁體中文

一個用於管理 [Geminicli](https://github.com/google/geminicli) 擴充功能和 MCP (Model Context Protocol) 伺服器的文字介面 (TUI) 工具。

![授權條款](https://img.shields.io/badge/license-MIT-blue.svg)
![Node 版本](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

### 功能特色

- 🎯 **擴充功能管理**：啟用/停用 Geminicli 擴充功能
- 🔌 **擴充功能內的 MCP 伺服器管理**：控制擴充功能內的 MCP 伺服器
- 🌐 **獨立 MCP 伺服器管理**：管理 `settings.json` 中的獨立 MCP 伺服器
- 🎨 **互動式 TUI**：易於使用的終端介面，支援鍵盤導航
- 💾 **自動備份**：儲存前自動備份設定檔
- ⚡ **快速且輕量**：使用 React Ink 打造流暢的終端渲染

### 畫面截圖

```
Geminicli Extension & MCP Server Manager

> [x] chrome-devtools-mcp
    [x] chrome-devtools (MCP Server)
  [ ] github
    [x] github (MCP Server)

--- Standalone MCP Servers ---
  [x] zen (Standalone)
  [ ] pointer (Standalone)
  [ ] context7 (Standalone)

Ready. Use arrow keys to navigate, Space to toggle, Enter to save & exit.
```

### 安裝

#### 前置需求

- Node.js >= 18.0.0
- 已安裝並設定好 [Geminicli](https://github.com/google/geminicli)

#### 從 npm 安裝（推薦）

```bash
npm install -g geminicli-addon-manage
```

#### 從原始碼安裝

```bash
git clone https://github.com/yourusername/geminicli-addon-manage.git
cd geminicli-addon-manage
npm install
npm link
```

### 使用方式

#### 執行 TUI

```bash
geminicli-manage-addon
```

#### 鍵盤控制

| 按鍵 | 動作 |
|-----|------|
| `↑` / `↓` | 在項目間導航 |
| `空白鍵` | 切換啟用/停用 |
| `Enter` | 儲存變更並退出 |
| `Esc` | 不儲存退出 |

#### 與 Geminicli 整合

您也可以使用 `/manage-addon` 斜線指令直接從 Geminicli 執行此工具：

1. 建立 `~/.gemini/commands/manage-addon.toml`：

```toml
description = "Manage extensions and MCP servers"

prompt = """
I will launch the Geminicli Addon Manager TUI tool for you.

IMPORTANT INSTRUCTIONS:
1. Use Ctrl+C to interact with the TUI tool (arrow keys, space, enter)
2. After making changes, you MUST restart Gemini CLI for the new settings to take effect

Running the tool now...

Execute: `geminicli-manage-addon`

After you finish:
- Press Enter to save and exit
- Press Esc to exit without saving
- Then restart Gemini CLI to apply the changes
"""
```

2. 在 Geminicli 中輸入：

```
/manage-addon
```

3. **重要**：按 `Ctrl+C` 來操作 TUI

4. **完成變更後**：重新啟動 Gemini CLI 以套用新設定

### 設定檔

此工具管理以下設定檔：

| 檔案 | 用途 |
|------|------|
| `~/.gemini/extensions/extension-enablement.json` | 擴充功能啟用/停用狀態 |
| `~/.gemini/extensions/mcp-server-enablement.json` | 擴充功能內的 MCP 伺服器狀態 |
| `~/.gemini/settings.json` | 獨立 MCP 伺服器狀態（透過 `mcp.excluded`） |

所有檔案在儲存前都會自動備份為 `.bak` 副檔名。

### 運作原理

#### 擴充功能管理

擴充功能透過修改 `extension-enablement.json` 中的 `overrides` 陣列來啟用/停用：

- 啟用：`["/Users/username/*"]`
- 停用：`["!/Users/username/*"]`

#### 擴充功能內的 MCP 伺服器

擴充功能內的 MCP 伺服器透過 `mcp-server-enablement.json` 管理：

```json
{
  "github": {
    "github": true
  },
  "chrome-devtools-mcp": {
    "chrome-devtools": false
  }
}
```

#### 獨立 MCP 伺服器

獨立 MCP 伺服器（定義在 `settings.json` 中）透過 `mcp.excluded` 陣列管理：

```json
{
  "mcp": {
    "excluded": ["pointer", "context7", "deepwiki"]
  }
}
```

### 開發

#### 設定

```bash
git clone https://github.com/yourusername/geminicli-addon-manage.git
cd geminicli-addon-manage
npm install
```

#### 本地執行

```bash
npm start
```

#### 專案結構

```
geminicli-addon-manage/
├── index.js          # 入口點
├── ui.js             # TUI 邏輯和元件
├── package.json      # 專案設定
└── README.md         # 本檔案
```

### 技術細節

- **框架**：[Ink](https://github.com/vadimdemedes/ink) - CLI 的 React
- **語言**：ES6 Modules (Node.js)
- **相容性**：Node.js v18+（已在 v25.2.1 測試）
- **不使用 JSX**：使用 `React.createElement` 以達到最大相容性

### 故障排除

#### 找不到指令

如果安裝後找不到 `geminicli-manage-addon`：

1. 檢查 npm 全域 bin 目錄：
   ```bash
   npm config get prefix
   ```

2. 確保 bin 目錄在您的 PATH 中：
   ```bash
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

#### 權限錯誤

如果儲存時遇到權限錯誤：

```bash
# 檢查檔案權限
ls -la ~/.gemini/extensions/extension-enablement.json
ls -la ~/.gemini/settings.json

# 如需修正
chmod 644 ~/.gemini/extensions/extension-enablement.json
chmod 644 ~/.gemini/settings.json
```

### 貢獻

歡迎貢獻！請隨時提交 Pull Request。

1. Fork 此儲存庫
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

### 致謝

- 為 [Geminicli](https://github.com/google/geminicli) 打造
- 由 [Ink](https://github.com/vadimdemedes/ink) 驅動
- 靈感來自於更簡便的 Geminicli 設定管理需求

### 支援

如果您遇到任何問題或有疑問：

- 🐛 [回報錯誤](https://github.com/yourusername/geminicli-addon-manage/issues)
- 💡 [請求功能](https://github.com/yourusername/geminicli-addon-manage/issues)
- 📖 [閱讀文件](https://github.com/yourusername/geminicli-addon-manage#readme)

### 更新日誌

#### v1.0.0 (2025-11-30)

- ✨ 首次發布
- ✅ 擴充功能管理
- ✅ 擴充功能內的 MCP 伺服器管理
- ✅ 獨立 MCP 伺服器管理
- ✅ 互動式 TUI 與鍵盤導航
- ✅ 自動備份功能

---

Made with ❤️ for the Geminicli community
