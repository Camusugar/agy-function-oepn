const https = require('https');
const { evalInPage } = require('./cdp_helper');

async function getAvailableFlags() {
  const info = await evalInPage(`
    (() => {
      const scripts = Array.from(document.querySelectorAll('script[src*="main.js"]'));
      return scripts.length > 0 ? scripts[0].src : location.origin + '/main.js';
    })()
  `);

  const url = new URL(info);
  const data = await new Promise((resolve, reject) => {
    https.get({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      rejectUnauthorized: false
    }, (res) => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => resolve(buf));
    }).on('error', reject);
  });

  const regex = /"(enable-[a-z0-9]+(?:-[a-z0-9]+)*)"/g;
  const flags = new Set();
  let m;
  while ((m = regex.exec(data)) !== null) {
    flags.add(m[1]);
  }
  return Array.from(flags).sort();
}

async function getActiveFlags() {
  const raw = await evalInPage('window.localStorage.getItem("jetski.developer.customFlagOverrides")');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

async function setFlags(updates, shouldReload = false) {
  const script = `
    (() => {
      let current = {};
      try {
        const raw = window.localStorage.getItem("jetski.developer.customFlagOverrides");
        if (raw) current = JSON.parse(raw);
      } catch (e) {}

      const updated = Object.assign({}, current, ${JSON.stringify(updates)});
      window.localStorage.setItem("jetski.developer.customFlagOverrides", JSON.stringify(updated));
      return updated;
    })()
  `;
  const result = await evalInPage(script);
  if (shouldReload) {
    await evalInPage('location.reload()');
  }
  return result;
}

async function removeFlags(flagNames, shouldReload = false) {
  const script = `
    (() => {
      let current = {};
      try {
        const raw = window.localStorage.getItem("jetski.developer.customFlagOverrides");
        if (raw) current = JSON.parse(raw);
      } catch (e) {}

      for (const f of ${JSON.stringify(flagNames)}) {
        delete current[f];
      }
      window.localStorage.setItem("jetski.developer.customFlagOverrides", JSON.stringify(current));
      return current;
    })()
  `;
  const result = await evalInPage(script);
  if (shouldReload) {
    await evalInPage('location.reload()');
  }
  return result;
}

async function openDevScreen() {
  const script = `
    (() => {
      let u = new URL(location.href);
      u.searchParams.set("settingsOpen", "true");
      u.searchParams.set("settingsScreen", "developer");
      history.pushState({}, "", u);
      dispatchEvent(new PopStateEvent("popstate"));
      return u.href;
    })()
  `;
  return await evalInPage(script);
}

async function resetAllFlags() {
  await evalInPage('window.localStorage.removeItem("jetski.developer.customFlagOverrides")');
  await evalInPage('location.reload()');
}

(async () => {
  const cmd = process.argv[2] || 'status';

  try {
    if (cmd === 'list') {
      const flags = await getAvailableFlags();
      console.log('Available Feature Flags in Antigravity (' + flags.length + ' found):');
      for (const f of flags) {
        console.log('  - ' + f);
      }
    } else if (cmd === 'status') {
      const active = await getActiveFlags();
      console.log('Currently Active Flag Overrides:');
      console.log(JSON.stringify(active, null, 2));
    } else if (cmd === 'enable') {
      const targetFlags = process.argv.slice(3);
      if (targetFlags.length === 0) {
        console.error('Specify at least one flag name to enable.');
        process.exit(1);
      }
      const updates = {};
      for (const f of targetFlags) {
        updates[f] = true;
      }
      const res = await setFlags(updates, true);
      console.log('Updated flags (page reloaded):', JSON.stringify(res, null, 2));
    } else if (cmd === 'disable') {
      const targetFlags = process.argv.slice(3);
      if (targetFlags.length === 0) {
        console.error('Specify at least one flag name to disable.');
        process.exit(1);
      }
      const res = await removeFlags(targetFlags, true);
      console.log('Updated flags (page reloaded):', JSON.stringify(res, null, 2));
    } else if (cmd === 'devscreen') {
      const url = await openDevScreen();
      console.log('Developer Settings screen opened in Antigravity window:', url);
    } else if (cmd === 'reset') {
      await resetAllFlags();
      console.log('All custom flag overrides cleared. Page reloaded.');
    } else {
      console.log('Usage: node explore_flags.js <list|status|enable|disable|devscreen|reset>');
    }
  } catch (err) {
    console.error('Operation failed:', err.message);
    process.exit(1);
  }
})();
