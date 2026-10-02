// Local QA only. This server is never a Worker entry point or a production auth mode.
import { createServer } from 'node:http';
import app from '../src/platform.js';
import { environment,seed } from './helpers.mjs';
const fixture = environment(), originalFetch = globalThis.fetch;
globalThis.fetch = (input,options) => new URL(typeof input === 'string' ? input : input.url).hostname.endsWith('googleapis.com') ? fixture.provider(input,options) : originalFetch(input,options);
await seed(fixture);
for (const [username, currentPassword, password] of [['00123','StudentFirst123','StudentPreview123'],['00456','StudentFirst456','StudentPreview456']]) {
  const session = await fixture.call('/auth/login',{ method:'POST',body:{ username,password:currentPassword } });
  const change = await fixture.call('/auth/password',{ method:'PUT',cookie:session.cookie,body:{ currentPassword,password } });
  if (change.status !== 200) throw new Error('Could not prepare local preview student');
}
fixture.env.APP_ORIGIN = 'http://127.0.0.1:5174';
createServer(async (request,response) => {
  try {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    const incoming = new Request(`http://127.0.0.1:8788${request.url}`,{ method:request.method,headers:request.headers,body:['GET','HEAD'].includes(request.method) ? undefined : Buffer.concat(chunks) });
    const result = await app.fetch(incoming,fixture.env);
    response.writeHead(result.status,{ ...Object.fromEntries(result.headers),'X-Sabai-Test-Mode':'true' });
    response.end(Buffer.from(await result.arrayBuffer()));
  } catch { response.writeHead(500,{ 'Content-Type':'application/json' }); response.end(JSON.stringify({ error:'Local test server failed' })); }
}).listen(8788,'127.0.0.1',() => console.log('LOCAL QA API: http://127.0.0.1:8788 — synthetic accounts and files only'));
