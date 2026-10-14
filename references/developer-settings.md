# Antigravity Developer Settings & Internals

This document details the internal architecture, remote debugging interfaces, and developer control mechanisms of Antigravity.

## Remote Debugging Architecture (CDP)

Antigravity operates on Electron with an active Chromium DevTools Protocol (CDP) port.

### Port Discovery

When Antigravity starts, it records the active debugging port to:

- Windows: `%APPDATA%\Antigravity\DevToolsActivePort`
- Linux / WSL: `/mnt/c/Users/<user>/AppData/Roaming/Antigravity/DevToolsActivePort`

File format:
Line 1: Port number (e.g., `49333`)
Line 2: Browser target path (e.g., `/devtools/browser/<uuid>`)

### WebSocket Endpoints

- Target list: `http://127.0.0.1:<port>/json`
- Page target URL: `ws://127.0.0.1:<port>/devtools/page/<page-id>`

The `cdp_helper.js` script reads this port dynamically and executes JavaScript in the main renderer context using `Runtime.evaluate`.

## Flag Storage Mechanism

All feature flag overrides are stored in renderer localStorage:

- Key: `jetski.developer.customFlagOverrides`
- Value: JSON object mapping flag names to booleans

Example:
```json
{
  "enable-conversation-forking": true,
  "enable-fork-in-new-worktree": true,
  "enable-fork-at-historical-step": true,
  "enable-developer-mode": true
}
```

## Native Developer Screen

Antigravity has a built-in Developer settings interface accessible through URL search parameters:

- Query: `?settingsOpen=true&settingsScreen=developer`
- Direct Navigation: Push this query state into `location.href` and fire a `PopStateEvent('popstate')` to open the modal without page reload.

## ASAR Zero-Drift Patching

Antigravity packages core Electron scripts into `resources/app.asar`.

- File format: Chromium Pickle archive
- Structure: 16-byte Pickle header followed by a JSON file index table.
- Offset formula: `baseOffset = 8 + header.readUInt32LE(4)`
- Preload entry: `header.files.dist.files['preload.js']`
- Safe patch requirement: The replacement must preserve exact byte size by utilizing unused comment blocks and whitespace padding, ensuring zero header alteration and zero file offset drift.
