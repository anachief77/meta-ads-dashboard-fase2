#!/usr/bin/env node
const { execFileSync, spawnSync } = require('node:child_process');

const owner = 'anachief77';
const repo = 'meta-ads-dashboard-fase2';
const repoUrl = `https://github.com/${owner}/${repo}.git`;

function getToken() {
  const input = 'protocol=https\nhost=github.com\nusername=anachief77\n\n';
  const out = spawnSync('git', ['credential', 'fill'], { input, encoding: 'utf8' });
  if (out.status !== 0) return '';
  const password = out.stdout.split('\n').find(line => line.startsWith('password='));
  return password ? password.slice('password='.length).trim() : '';
}

function github(path, method = 'GET', body) {
  const token = getToken();
  if (!token) throw new Error('Nenhum token GitHub encontrado no credential helper para anachief77.');
  const args = [
    '-sS',
    '-w', '\n%{http_code}',
    '-H', 'Accept: application/vnd.github+json',
    '-H', `Authorization: Bearer ${token}`,
    '-H', 'X-GitHub-Api-Version: 2022-11-28',
    '-X', method,
    `https://api.github.com${path}`,
  ];
  if (body) args.push('-d', JSON.stringify(body));
  const out = execFileSync('curl', args, { encoding: 'utf8' });
  const idx = out.lastIndexOf('\n');
  return { text: out.slice(0, idx), status: Number(out.slice(idx + 1)) };
}

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit' });
}

let repoExists = false;
try {
  const check = github(`/repos/${owner}/${repo}`);
  repoExists = check.status === 200;
  if (!repoExists && check.status !== 404) throw new Error(`GitHub check retornou HTTP ${check.status}: ${check.text}`);
} catch (error) {
  if (!String(error.message).includes('404')) throw error;
}

if (!repoExists) {
  const created = github('/user/repos', 'POST', {
    name: repo,
    private: false,
    description: 'Dashboard bruto de escala da mineração Meta Ads Library para ofertas LATAM/USD',
    auto_init: false,
  });
  if (![200, 201, 422].includes(created.status)) throw new Error(`Falha ao criar repo: HTTP ${created.status}: ${created.text}`);
  console.log(`Repo criado ou já existente: https://github.com/${owner}/${repo}`);
} else {
  console.log(`Repo já existe: https://github.com/${owner}/${repo}`);
}

try { run('git', ['remote', 'remove', 'origin']); } catch (_) {}
run('git', ['remote', 'add', 'origin', repoUrl]);

try { run('git', ['config', 'user.name', 'Ana Assistente']); } catch (_) {}
try { run('git', ['config', 'user.email', 'ana@openclaw.local']); } catch (_) {}

run('git', ['add', 'index.html', 'vercel.json', 'README_AUTOMACAO.md', 'scripts/deploy.sh', 'scripts/create_repo_and_push.cjs']);
const diff = spawnSync('git', ['diff', '--cached', '--quiet']);
if (diff.status !== 0) run('git', ['commit', '-m', 'Publica dashboard Meta Ads']);
else console.log('Nada novo para commitar.');
run('git', ['branch', '-M', 'main']);
run('git', ['push', '-u', 'origin', 'main']);
console.log(`Publicado em: https://github.com/${owner}/${repo}`);
