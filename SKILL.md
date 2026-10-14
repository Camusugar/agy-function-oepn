---
name: agy-function-oepn
description: Unlocks hidden Antigravity and Gemini desktop capabilities including the F12 Trajectory Debug View hotkey, Conversation Forking (branching sessions at historical steps or into new Git worktrees), native Developer Mode settings, and dynamic experimental feature flag discovery and activation. Use this skill whenever the user requests unlocking F12, restoring F12 shortcuts after Antigravity updates, enabling conversation forking, accessing developer mode, exploring unreleased features, or managing experimental flags.
---

# agy-function-oepn

This skill provides automated tools and procedures to unlock, restore, and explore hidden capabilities inside the Antigravity desktop client.

## Core Capabilities

1. **F12 Trajectory Debug Panel Hotkey**: Restores or injects the global F12 shortcut into `dist/preload.js` within `app.asar` using a zero-drift, byte-exact in-place binary patch.
2. **Conversation Forking**: Unlocks session branching buttons on each conversation step, supporting forks in the current workspace or isolated Git worktrees.
3. **Feature Flag Explorer**: Discovers, toggles, and manages over 70 unreleased experimental feature flags built into the Antigravity frontend.
4. **Native Developer Settings**: Directly launches the hidden Developer settings panel inside the Antigravity UI.

## Workflows

### Workflow 1: Enable or Restore F12 Debug Hotkey

Use this workflow when the user requests enabling F12 or when an Antigravity auto-update has wiped out the F12 hotkey.

1. Execute the zero-drift ASAR patch script:
   ```bash
   node scripts/patch_f12.js
   ```
2. Verify the output indicates success or that the patch is already present.
3. Instruct the user to reload the client with `Ctrl + R` or restart the Antigravity application.
4. Press `F12` to verify the Trajectory Debug drawer opens.

### Workflow 2: Enable Conversation Forking

Use this workflow when the user wants to fork conversations, branch from historical messages, or create new worktrees from a chat.

1. Execute the fork activation script:
   ```bash
   node scripts/enable_fork.js
   ```
2. The script configures the required flags in `window.localStorage` via CDP and reloads the active Antigravity window.
3. Confirm that `forkButtonCount` is greater than 0.
4. The user can now click the "Fork Conversation" icon on any message card.

### Workflow 3: Explore and Toggle Hidden Feature Flags

Use this workflow to discover unreleased Gemini/Antigravity features and toggle experimental capabilities.

1. List all available experimental flags in the current build:
   ```bash
   node scripts/explore_flags.js list
   ```
2. Inspect currently active flag overrides:
   ```bash
   node scripts/explore_flags.js status
   ```
3. Enable specific flags:
   ```bash
   node scripts/explore_flags.js enable <flag-name-1> <flag-name-2>
   ```
4. Disable specific flags:
   ```bash
   node scripts/explore_flags.js disable <flag-name-1>
   ```
5. Reset all overrides back to official defaults:
   ```bash
   node scripts/explore_flags.js reset
   ```

For detailed flag descriptions, see [references/feature-flags.md](references/feature-flags.md).

### Workflow 4: Launch Native Developer Settings Screen

Use this workflow to open Antigravity's hidden internal developer interface:

1. Run the developer screen opener:
   ```bash
   node scripts/explore_flags.js devscreen
   ```
2. The Antigravity client will immediately present the Developer tab under Settings.

For architectural details, see [references/developer-settings.md](references/developer-settings.md).
