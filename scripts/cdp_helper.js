const fs = require('fs');
const path = require('path');
const http = require('http');

function getDevToolsPort() {
  let devToolsPath = '';
  if (process.platform === 'win32') {
    devToolsPath = path.join(process.env.APPDATA, 'Antigravity', 'DevToolsActivePort');
  } else {
    devToolsPath = '/mnt/c/Users/verse/AppData/Roaming/Antigravity/DevToolsActivePort';
    if (!fs.existsSync(devToolsPath)) {
      devToolsPath = '/mnt/c/Users/' + (process.env.USER || 'verse') + '/AppData/Roaming/Antigravity/DevToolsActivePort';
    }
  }

  if (!fs.existsSync(devToolsPath)) {
    throw new Error('DevToolsActivePort file not found at: ' + devToolsPath);
  }

  const lines = fs.readFileSync(devToolsPath, 'utf8').trim().split(/\r?\n/);
  return parseInt(lines[0], 10);
}

async function evalInPage(expression) {
  const port = getDevToolsPort();
  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:' + port + '/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.type === 'page');
  if (!page) {
    throw new Error('No active Antigravity page found');
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        ws.close();
        if (msg.result && msg.result.exceptionDetails) {
          reject(new Error(JSON.stringify(msg.result.exceptionDetails)));
        } else {
          resolve(msg.result && msg.result.result ? msg.result.result.value : msg.result);
        }
      }
    };

    ws.onerror = reject;
  });
}

module.exports = {
  getDevToolsPort,
  evalInPage
};
