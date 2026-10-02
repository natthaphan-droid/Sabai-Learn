import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cwd = fileURLToPath(new URL('../',import.meta.url));
const cli = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url));
const operation = process.argv[2] === 'migrate' ? ['d1','migrations','apply','sabailearn','--local'] : ['dev','--ip','127.0.0.1','--port','8787'];
const child = spawn(process.execPath,[cli,...operation],{ cwd,stdio:'inherit',env:{ ...process.env,WRANGLER_LOG_PATH:fileURLToPath(new URL('../.wrangler/logs/',import.meta.url)),WRANGLER_REGISTRY_PATH:fileURLToPath(new URL('../.wrangler/registry/',import.meta.url)),WRANGLER_SEND_METRICS:'false' } });
child.on('exit',code => { process.exitCode = code || 0; });
