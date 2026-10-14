const { evalInPage } = require('./cdp_helper');

(async () => {
  try {
    const forkFlags = {
      "enable-conversation-forking": true,
      "enable-fork-in-new-worktree": true,
      "enable-fork-at-historical-step": true,
      "enable-developer-mode": true
    };

    const script = `
      (() => {
        let current = {};
        try {
          const raw = window.localStorage.getItem("jetski.developer.customFlagOverrides");
          if (raw) current = JSON.parse(raw);
        } catch (e) {}

        const updated = Object.assign({}, current, ${JSON.stringify(forkFlags)});
        window.localStorage.setItem("jetski.developer.customFlagOverrides", JSON.stringify(updated));
        return updated;
      })()
    `;

    const result = await evalInPage(script);
    console.log('Fork flags enabled:', JSON.stringify(result, null, 2));

    console.log('Reloading Antigravity window to apply flags...');
    await evalInPage('location.reload()');

    await new Promise(r => setTimeout(r, 2500));

    const check = await evalInPage(`
      (() => {
        const btns = document.querySelectorAll("[aria-label='Fork Conversation']");
        return {
          forkButtonCount: btns.length,
          flags: window.localStorage.getItem("jetski.developer.customFlagOverrides")
        };
      })()
    `);

    console.log('Status after reload:', JSON.stringify(check, null, 2));
    console.log('Conversation Forking feature is now active.');
  } catch (err) {
    console.error('Failed to enable fork feature:', err.message);
    process.exit(1);
  }
})();
