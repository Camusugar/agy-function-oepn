# Antigravity Feature Flags Reference

This document categorizes all discovered experimental feature flags available in Antigravity.

## Conversation & Workflow Flags

| Flag Name | Description |
| :--- | :--- |
| `enable-conversation-forking` | Enables forking a conversation at any branch point |
| `enable-fork-at-historical-step` | Enables branching from any prior step in conversation history |
| `enable-fork-in-new-worktree` | Enables creating a new Git worktree upon conversation fork |
| `enable-conversation-groups` | Enables organizing conversations into collapsible groups |
| `enable-conversation-navigator` | Enables rapid timeline navigation for conversation steps |
| `enable-conversation-search-v2` | Advanced conversation history search |
| `enable-conversation-selection-quoting` | Quick quoting of selected message blocks into input prompt |
| `enable-conversation-sharing-prototype` | Prototype for exporting and sharing conversation sessions |
| `enable-resume-conversations-from-restart` | Automatically restores active conversation state after client relaunch |

## Agent & Model Flags

| Flag Name | Description |
| :--- | :--- |
| `enable-agent-team` | Enables multi-agent team collaboration mode |
| `enable-battle-mode` | Enables side-by-side agent battle comparison mode |
| `enable-battle-mode-custom-agents` | Custom agent configuration support in battle mode |
| `enable-browser-subagent-v2` | Upgraded browser automation subagent |
| `enable-concierge-agent` | Built-in guide and onboarding concierge assistant |
| `enable-thought-editing` | Allows viewing and editing internal agent reasoning thoughts |
| `enable-thought-steering-from-selection` | Steers reasoning path based on highlighted text |
| `enable-thumbs-down-reroll` | Immediate model reroll on thumbs-down feedback |

## UI & Layout Flags

| Flag Name | Description |
| :--- | :--- |
| `enable-split-view` | Split-pane view for side-by-side editing and chatting |
| `enable-file-explorer-tab` | Integrated file explorer panel inside main workspace |
| `enable-pdf-viewer` | Built-in native PDF viewer inside Antigravity |
| `enable-notebook-rendering` | Native Jupyter notebook (.ipynb) rendering and preview |
| `enable-hub-builtin-browser` | Internal Chromium web viewer inside sidebar |
| `enable-aux-pane-redesign` | Modernized auxiliary sidebar layout |
| `enable-code-search-palette` | Global code search palette |

## Developer & Debugging Flags

| Flag Name | Description |
| :--- | :--- |
| `enable-developer-mode` | Unlocks native Developer settings tab and internal diagnostics |
| `enable-dev-mode` | General development switches |
| `enable-trajectory-debug-tools` | Additional trajectory inspection toolbars |
| `enable-trajectory-debug-in-battle-mode` | Enables trajectory inspection during agent battle mode |
