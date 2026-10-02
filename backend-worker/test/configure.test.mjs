import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve, sep } from 'node:path';

test('configure Firebase first, reject incomplete Drive settings, and preserve keys', async t => {
  const workspace = fileURLToPath(new URL('../.wrangler/', import.meta.url));
  await mkdir(workspace, { recursive: true });
  const root = await mkdtemp(join(workspace, 'configure-check-'));
  t.after(async () => {
    assert.ok(resolve(root).startsWith(resolve(workspace) + sep));
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(join(root, 'scripts'));
  await copyFile(new URL('../scripts/configure.mjs', import.meta.url), join(root, 'scripts/configure.mjs'));
  await writeFile(join(root, 'account.json'), JSON.stringify({ project_id: 'fixture', client_email: 'fixture@example.invalid', private_key: 'fixture key' }));
  await writeFile(join(root, '.dev.vars'), "LEGACY='fixture'\n");
  const config = { firebaseApiKey: 'fixture-api-key', firebaseServiceAccountFile: 'account.json', googleOAuthClientId: '', googleOAuthClientSecret: '' };
  const saveConfig = () => writeFile(join(root, 'setup.config.json'), JSON.stringify(config));
  const run = () => spawnSync(process.execPath, [join(root, 'scripts/configure.mjs')], { encoding: 'utf8' });
  const values = async () => JSON.parse(await readFile(join(root, 'secrets/worker-secrets.json'), 'utf8'));
  await saveConfig();
  assert.equal(run().status, 0);
  const initial = await values();
  assert.equal(initial.FIREBASE_PROJECT_ID, 'fixture');
  assert.equal(initial.GOOGLE_OAUTH_CLIENT_ID, undefined);
  assert.equal(Buffer.from(initial.DRIVE_TOKEN_ENCRYPTION_KEY, 'base64').length, 32);
  assert.ok(initial.BOOTSTRAP_SECRET);
  assert.equal(await readFile(join(root, 'secrets/previous-local.env'), 'utf8'), "LEGACY='fixture'\n");

  config.googleOAuthClientId = 'fixture-client';
  await saveConfig();
  assert.equal(run().status, 1);
  assert.deepEqual(await values(), initial);

  config.googleOAuthClientSecret = 'fixture-client-secret';
  await saveConfig();
  assert.equal(run().status, 0);
  const complete = await values();
  assert.equal(complete.GOOGLE_OAUTH_CLIENT_ID, 'fixture-client');
  assert.equal(complete.GOOGLE_OAUTH_CLIENT_SECRET, 'fixture-client-secret');
  assert.equal(complete.BOOTSTRAP_SECRET, initial.BOOTSTRAP_SECRET);
  assert.equal(complete.DRIVE_TOKEN_ENCRYPTION_KEY, initial.DRIVE_TOKEN_ENCRYPTION_KEY);

  config.googleOAuthClientId = 'ใส่ Client ID';
  config.googleOAuthClientSecret = 'ใส่ Client secret';
  await saveConfig();
  assert.equal(run().status, 0);
  assert.deepEqual(await values(), complete);
});
