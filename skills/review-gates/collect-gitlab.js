#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CWD = process.cwd();
const CATALOG = path.join(CWD, '.review-gates');
const THREADS = path.join(CATALOG, 'threads');
const HANDLED = path.join(CATALOG, 'handled.txt');
const LAST_RUN = path.join(CATALOG, 'last-run.txt');
const N = Number(process.argv[2] || 20);

fs.mkdirSync(THREADS, { recursive: true });

const sh = (cmd, args) => execFileSync(cmd, args, { maxBuffer: 64 * 1024 * 1024 }).toString();

const remote = sh('git', ['remote', 'get-url', 'origin']).trim();
if (/github\.com[:/]/i.test(remote)) {
  console.error('origin is GitHub — run collect-github.js instead');
  process.exit(1);
}

const projectPath = remote
  .replace(/\.git$/, '')
  .replace(/^[a-z]+:\/\/[^/]+\//i, '')
  .replace(/^[^@/]+@[^:]+:/, '');
const project = encodeURIComponent(projectPath);

const glabJson = (p) => JSON.parse(sh('glab', ['api', p]));
const api = (endpoint) => glabJson(`projects/${project}/${endpoint}`);

// GitLab `bot` covers project/group tokens, alert/support bots, service accounts.
// Notes often omit it — GET /users/:id once per author. Lookup fail → keep the note.
const authorHumanCache = new Map();
const authorIsHuman = (author) => {
  if (!author || author.id == null) return false;
  if (typeof author.bot === 'boolean') return author.bot === false;
  if (authorHumanCache.has(author.id)) return authorHumanCache.get(author.id);
  let human = true;
  try {
    const user = glabJson(`users/${author.id}`);
    if (typeof user.bot === 'boolean') human = user.bot === false;
    else if (user.user_type) human = user.user_type === 'human';
  } catch {
    human = true;
  }
  authorHumanCache.set(author.id, human);
  return human;
};
const isHumanNote = (n) => !n.system && authorIsHuman(n.author);
const slug = (s) => (s || 'general').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-60);

const readHandled = () =>
  fs.existsSync(HANDLED)
    ? fs.readFileSync(HANDLED, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    : [];
const handled = new Set(readHandled());
const iidFromUrl = (url) => {
  const m = String(url).match(/\/merge_requests\/(\d+)/);
  return m ? Number(m[1]) : 0;
};
const cursor = Math.max(0, ...[...handled].map(iidFromUrl));

const pickNext = () => {
  const out = [];
  for (let page = 1; out.length < N; page += 1) {
    const mrs = api(`merge_requests?state=merged&order_by=created_at&sort=desc&per_page=100&page=${page}`);
    if (mrs.length === 0) break;
    let sawNewer = false;
    for (const mr of mrs) {
      if (mr.iid <= cursor) continue;
      sawNewer = true;
      if (handled.has(mr.web_url)) continue;
      out.push(mr);
      if (out.length === N) break;
    }
    if (!sawNewer) break;
  }
  return out;
};

const run = pickNext();
if (run.length === 0) {
  console.log(
    cursor ? `Nothing newer than !${cursor}.` : 'Nothing to do — no merged MRs.'
  );
  if (fs.existsSync(LAST_RUN)) process.stdout.write(fs.readFileSync(LAST_RUN, 'utf8'));
  process.exit(0);
}

const written = [];
for (const mr of run) {
  const discs = api(`merge_requests/${mr.iid}/discussions?per_page=100`);
  let idx = 0;
  for (const d of discs) {
    const notes = d.notes.filter(isHumanNote);
    if (notes.length === 0) continue;
    idx += 1;
    const first = notes[0];
    const pos = first.position || {};
    const file = pos.new_path || pos.old_path || null;
    const line = pos.new_line || pos.old_line || null;
    const resolved = d.notes.some((n) => n.resolved);

    const fname = `mr${mr.iid}-${String(idx).padStart(2, '0')}-${slug(file)}.md`;
    let md = `# MR !${mr.iid} — ${mr.title}\n\n`;
    md += `- **MR**: ${mr.web_url}\n`;
    md += `- **MR author**: @${mr.author.username}\n`;
    md += `- **Merged at**: ${mr.merged_at || '-'}\n`;
    if (file) md += `- **File**: \`${file}\`${line ? ` (line ${line})` : ''}\n`;
    md += `- **Thread started by**: @${first.author.username}\n`;
    md += `- **Resolved**: ${resolved ? 'yes' : 'no'}\n`;
    md += `- **Date**: ${first.created_at}\n`;
    md += `- **Source**: ${mr.web_url}#note_${first.id}\n\n`;
    md += `## Thread\n\n`;
    for (const n of notes) {
      md += `**@${n.author.username}** _(${n.created_at})_${n.resolved ? ' [resolved]' : ''}:\n\n`;
      md += `${(n.body || '').trim()}\n\n`;
    }
    fs.writeFileSync(path.join(THREADS, fname), md);
    written.push(path.join('.review-gates', 'threads', fname));
  }
}

const handledHeader =
  '# One merged-MR URL per line. Next collect takes iid newer than the max iid here.\n';
const lines = fs.existsSync(HANDLED)
  ? fs.readFileSync(HANDLED, 'utf8').replace(/\n*$/, '\n')
  : handledHeader;
fs.writeFileSync(HANDLED, lines + run.map((mr) => mr.web_url).join('\n') + '\n');

const newest = run[0];
const oldest = run[run.length - 1];
const highWater = Math.max(cursor, ...run.map((mr) => mr.iid));
const lastRun = [
  `at=${new Date().toISOString()}`,
  `forge=gitlab`,
  `mrs=${run.length}`,
  `threads=${written.length}`,
  `newest=!${newest.iid}`,
  `oldest=!${oldest.iid}`,
  `cursor=!${highWater}`,
  `newest_url=${newest.web_url}`,
  `oldest_url=${oldest.web_url}`,
  '',
].join('\n');
fs.writeFileSync(LAST_RUN, lastRun);

console.log(`Collected ${run.length} MRs (!${newest.iid} … !${oldest.iid}) → ${written.length} threads`);
console.log(`Cursor: .review-gates/last-run.txt (next collect takes MRs newer than !${highWater})`);
for (const f of written) console.log(`  ${f}`);
