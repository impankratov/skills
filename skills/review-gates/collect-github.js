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
const ghJson = (p) => JSON.parse(sh('gh', ['api', p]));

const remote = sh('git', ['remote', 'get-url', 'origin']).trim();
if (!/github\.com[:/]/i.test(remote) && !/github\./i.test(remote)) {
  console.error('origin is not GitHub — run collect-gitlab.js instead');
  process.exit(1);
}

const repoView = JSON.parse(sh('gh', ['repo', 'view', '--json', 'nameWithOwner']));
const repo = repoView.nameWithOwner;

const isHumanUser = (u) => u && u.type !== 'Bot';
const slug = (s) => (s || 'general').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-60);

const readHandled = () =>
  fs.existsSync(HANDLED)
    ? fs.readFileSync(HANDLED, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    : [];
const handled = new Set(readHandled());
const numberFromUrl = (url) => {
  const m = String(url).match(/\/pull\/(\d+)/);
  return m ? Number(m[1]) : 0;
};
const cursor = Math.max(0, ...[...handled].map(numberFromUrl));

const pickNext = () => {
  const out = [];
  for (let page = 1; out.length < N; page += 1) {
    const prs = ghJson(
      `repos/${repo}/pulls?state=closed&sort=created&direction=desc&per_page=100&page=${page}`
    );
    if (!Array.isArray(prs) || prs.length === 0) break;
    let sawNewer = false;
    for (const pr of prs) {
      if (!pr.merged_at) continue;
      if (pr.number <= cursor) continue;
      sawNewer = true;
      if (handled.has(pr.html_url)) continue;
      out.push(pr);
      if (out.length === N) break;
    }
    if (!sawNewer) break;
  }
  return out;
};

const run = pickNext();
if (run.length === 0) {
  console.log(
    cursor ? `Nothing newer than #${cursor}.` : 'Nothing to do — no merged PRs.'
  );
  if (fs.existsSync(LAST_RUN)) process.stdout.write(fs.readFileSync(LAST_RUN, 'utf8'));
  process.exit(0);
}

const rootId = (byId, c) => {
  let id = c.in_reply_to_id ? c.in_reply_to_id : c.id;
  const seen = new Set();
  while (byId.has(id) && byId.get(id).in_reply_to_id && !seen.has(id)) {
    seen.add(id);
    id = byId.get(id).in_reply_to_id;
  }
  return id;
};

const writeThread = (pr, idx, file, line, source, startedBy, date, notes) => {
  const fname = `pr${pr.number}-${String(idx).padStart(2, '0')}-${slug(file)}.md`;
  let md = `# PR #${pr.number} — ${pr.title}\n\n`;
  md += `- **PR**: ${pr.html_url}\n`;
  md += `- **PR author**: @${pr.user.login}\n`;
  md += `- **Merged at**: ${pr.merged_at || '-'}\n`;
  if (file) md += `- **File**: \`${file}\`${line ? ` (line ${line})` : ''}\n`;
  md += `- **Thread started by**: @${startedBy}\n`;
  md += `- **Date**: ${date}\n`;
  md += `- **Source**: ${source}\n\n`;
  md += `## Thread\n\n`;
  for (const n of notes) {
    md += `**@${n.login}** _(${n.created_at})_:\n\n`;
    md += `${(n.body || '').trim()}\n\n`;
  }
  fs.writeFileSync(path.join(THREADS, fname), md);
  return path.join('.review-gates', 'threads', fname);
};

const written = [];
for (const pr of run) {
  let idx = 0;
  const issueComments = ghJson(`repos/${repo}/issues/${pr.number}/comments?per_page=100`);
  const reviewComments = ghJson(`repos/${repo}/pulls/${pr.number}/comments?per_page=100`);
  const reviews = ghJson(`repos/${repo}/pulls/${pr.number}/reviews?per_page=100`);

  for (const c of issueComments) {
    if (!isHumanUser(c.user) || !(c.body || '').trim()) continue;
    idx += 1;
    written.push(
      writeThread(pr, idx, null, null, c.html_url, c.user.login, c.created_at, [
        { login: c.user.login, created_at: c.created_at, body: c.body },
      ])
    );
  }

  const byId = new Map(reviewComments.map((c) => [c.id, c]));
  const groups = new Map();
  for (const c of reviewComments) {
    if (!isHumanUser(c.user) || !(c.body || '').trim()) continue;
    const rid = rootId(byId, c);
    if (!groups.has(rid)) groups.set(rid, []);
    groups.get(rid).push(c);
  }
  for (const comments of groups.values()) {
    comments.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    const first = comments[0];
    idx += 1;
    written.push(
      writeThread(
        pr,
        idx,
        first.path,
        first.line || first.original_line,
        first.html_url,
        first.user.login,
        first.created_at,
        comments.map((c) => ({ login: c.user.login, created_at: c.created_at, body: c.body }))
      )
    );
  }

  for (const r of reviews) {
    if (!isHumanUser(r.user) || !(r.body || '').trim()) continue;
    idx += 1;
    written.push(
      writeThread(pr, idx, null, null, r.html_url, r.user.login, r.submitted_at, [
        { login: r.user.login, created_at: r.submitted_at, body: r.body },
      ])
    );
  }
}

const handledHeader =
  '# One merged-PR URL per line. Next collect takes numbers newer than the max here.\n';
const lines = fs.existsSync(HANDLED)
  ? fs.readFileSync(HANDLED, 'utf8').replace(/\n*$/, '\n')
  : handledHeader;
fs.writeFileSync(HANDLED, lines + run.map((pr) => pr.html_url).join('\n') + '\n');

const newest = run[0];
const oldest = run[run.length - 1];
const highWater = Math.max(cursor, ...run.map((pr) => pr.number));
const lastRun = [
  `at=${new Date().toISOString()}`,
  `forge=github`,
  `prs=${run.length}`,
  `threads=${written.length}`,
  `newest=#${newest.number}`,
  `oldest=#${oldest.number}`,
  `cursor=#${highWater}`,
  `newest_url=${newest.html_url}`,
  `oldest_url=${oldest.html_url}`,
  '',
].join('\n');
fs.writeFileSync(LAST_RUN, lastRun);

console.log(`Collected ${run.length} PRs (#${newest.number} … #${oldest.number}) → ${written.length} threads`);
console.log(`Cursor: .review-gates/last-run.txt (next collect takes PRs newer than #${highWater})`);
for (const f of written) console.log(`  ${f}`);
