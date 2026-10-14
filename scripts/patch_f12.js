const fs = require('fs');
const path = require('path');
const vm = require('vm');

function resolveAsarPath() {
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA, 'Programs', 'antigravity', 'resources', 'app.asar');
  }
  const wslCandidate = '/mnt/c/Users/verse/AppData/Local/Programs/antigravity/resources/app.asar';
  if (fs.existsSync(wslCandidate)) {
    return wslCandidate;
  }
  return '/mnt/c/Users/' + (process.env.USER || 'verse') + '/AppData/Local/Programs/antigravity/resources/app.asar';
}

const asarPath = resolveAsarPath();
const bakPath = asarPath + '.bak';

if (!fs.existsSync(asarPath)) {
  console.error('app.asar not found at: ' + asarPath);
  process.exit(1);
}

const fd = fs.openSync(asarPath, 'r');
const headerMeta = Buffer.alloc(16);
fs.readSync(fd, headerMeta, 0, 16, 0);
const baseOffset = 8 + headerMeta.readUInt32LE(4);
const jsonLen = headerMeta.readUInt32LE(12);
const headerBuf = Buffer.alloc(jsonLen);
fs.readSync(fd, headerBuf, 0, jsonLen, 16);
const header = JSON.parse(headerBuf.toString('utf8'));

const pInfo = header.files.dist.files['preload.js'];
const pOffset = baseOffset + parseInt(pInfo.offset, 10);
const pSize = pInfo.size;

const pBuf = Buffer.alloc(pSize);
fs.readSync(fd, pBuf, 0, pSize, pOffset);
fs.closeSync(fd);

const origText = pBuf.toString('utf8');

if (origText.includes('trajectoryDebugOpen')) {
  console.log('F12 patch is already present in app.asar.');
  process.exit(0);
}

const f12Code = "window.addEventListener('keydown',e=>{if(e.key==='F12'){e.preventDefault();let u=new URL(location.href),s=u.searchParams;s.get('trajectoryDebugOpen')==='true'?s.delete('trajectoryDebugOpen'):s.set('trajectoryDebugOpen','true');history.pushState({},'',u);dispatchEvent(new PopStateEvent('popstate'))}});";

const commentTarget = [
  '/**',
  ' * Preload script \u2014 runs in every BrowserWindow before the page loads.',
  ' * Exposes a minimal, secure API via contextBridge so the renderer can',
  ' * communicate with the main-process auto-updater without nodeIntegration.',
  ' */'
].join('\n');

const origHandler1 = [
  '    onStateChanged: (callback) => {',
  '        const handler = (_event, state) => {',
  '            callback(state);',
  '        };',
  "        electron_1.ipcRenderer.on('updater:state-changed', handler);",
  '        // Return unsubscribe function',
  '        return () => {',
  "            electron_1.ipcRenderer.removeListener('updater:state-changed', handler);",
  '        };',
  '    },'
].join('\n');

const newHandler1 = [
  '    onStateChanged: (callback) => {',
  '        const handler = (_event, state) => { callback(state); };',
  "        electron_1.ipcRenderer.on('updater:state-changed', handler);",
  "        return () => { electron_1.ipcRenderer.removeListener('updater:state-changed', handler); };",
  '    },'
].join('\n');

if (!origText.includes(commentTarget) || !origText.includes(origHandler1)) {
  console.error('Target preload structure not found.');
  process.exit(1);
}

let patched = origText.replace(origHandler1, newHandler1);
const room = Buffer.byteLength(origText, 'utf8') - Buffer.byteLength(patched, 'utf8') + Buffer.byteLength(commentTarget, 'utf8');
const pad = room - Buffer.byteLength(f12Code, 'utf8');

if (pad < 1) {
  console.error('Insufficient padding buffer.');
  process.exit(1);
}

patched = patched.replace(commentTarget, f12Code + '\n' + ' '.repeat(pad - 1));

if (Buffer.byteLength(patched, 'utf8') !== pSize) {
  console.error('Exact byte match failed.');
  process.exit(1);
}

new vm.Script(patched);

fs.copyFileSync(asarPath, bakPath);

const wfd = fs.openSync(asarPath, 'r+');
fs.writeSync(wfd, Buffer.from(patched, 'utf8'), 0, pSize, pOffset);
fs.closeSync(wfd);

const vfd = fs.openSync(asarPath, 'r');
const vb = Buffer.alloc(pSize);
fs.readSync(vfd, vb, 0, pSize, pOffset);
fs.closeSync(vfd);

const vt = vb.toString('utf8');
new vm.Script(vt);

if (vt.includes('trajectoryDebugOpen') && vt === patched) {
  console.log('F12 patch successfully applied.');
} else {
  console.error('Verification failed.');
  process.exit(1);
}
