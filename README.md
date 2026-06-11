# Personal site — P. Kanellopoulos

Static site. No backend, no database, no build step. Deployable on any static host.

## Structure

```
site/
├── index.html            Bio / profile (landing)
├── publications.html     Scientific publications (2 slots, placeholders)
├── dissemination.html    LinkedIn posts, panels, event appearances
├── contact.html          Contact details (placeholders)
├── workspace/
│   ├── index.html        Locked workspace — passphrase gate + locker wall
│   ├── view.html         Project viewer — decrypts a project with its key
│   └── projects/
│       ├── manifest.json            List of projects shown on the wall
│       └── athens-microhub-note.json  Encrypted sample project
├── tools/
│   └── encrypt.html      Local tool: encrypt HTML projects, hash gate passphrases
└── assets/
    └── style.css         Design system
```

## Run locally

The workspace pages load JSON via `fetch`, which most browsers block on `file://`.
Run a local server from the `site/` folder:

```
python3 -m http.server 8000
# open http://localhost:8000
```

## Demo keys (CHANGE BEFORE DEPLOYING)

| What | Key |
|---|---|
| Workspace gate | `demo-key` |
| Sample project (locker A-01) | `demo-key` |

- Change the gate key: open `tools/encrypt.html` → section 3 → paste the new
  SHA-256 hash into `GATE_HASH` in `workspace/index.html`.
- The sample project is just a demo — delete it once you add real projects.

## How the locked workspace works (honest security model)

Two layers, with different strength:

1. **Gate (workspace/index.html)** — a passphrase whose SHA-256 hash is checked
   in the browser. This only *hides the list* from casual visitors. Anyone who
   reads the page source can see project slugs in `manifest.json`. Titles are
   visible there; content is not.

2. **Per-project encryption (real protection)** — every project HTML is stored
   as an AES-256-GCM encrypted bundle (key derived with PBKDF2-SHA256,
   310k iterations). Without the key, the content is cryptographically
   inaccessible even though the JSON file is publicly hosted. Decryption
   happens entirely in the visitor's browser; no key ever reaches a server.

**Sharing a project:** open it, click "Copy share link". The link has the form
`view.html?p=slug#k=KEY`. The key sits in the URL fragment (`#…`), which
browsers do not send to web servers. Anyone with the link can open the project,
so share it like you would share the key itself.

**If you ever need stronger protection** (e.g. truly hiding even titles, or
revoking access): put the site behind Cloudflare Access or Netlify password
protection. For working prototypes and project pages, the current model is
proportionate.

## Add a new project (from Claude, Replit, anywhere)

1. Export / save the project as a single self-contained `.html` file.
2. Open `tools/encrypt.html` in your browser (locally is fine).
3. Load the file, set a slug, title and a project key → download the `.json`.
4. Drop the `.json` into `workspace/projects/`.
5. Add an entry to `workspace/projects/manifest.json` (the tool prints the snippet).
6. Commit and push. Done — the locker appears on the wall.

Notes:
- Projects render inside a sandboxed iframe (`allow-scripts`), so interactive
  prototypes with JavaScript work. External API calls from inside a project
  depend on the target's CORS policy.
- Keys are not recoverable. If you lose a project key, re-encrypt the original HTML.

## Deploy

**GitHub Pages** (free): push the `site/` contents to a repo →
Settings → Pages → deploy from branch. Custom domain supported.

**Cloudflare Pages / Netlify** (free): drag-and-drop the folder or connect the
repo. Slightly better fit if you later want access controls or redirects.

## Customization checklist

- [ ] `contact.html` — real email + LinkedIn URL (marked with TODO comments)
- [ ] `publications.html` — fill in the two publications + DOI links
- [ ] `dissemination.html` — add links to the WMX Europe and GREEN-LOG entries; add LinkedIn posts using the template card
- [ ] `workspace/index.html` — change `GATE_HASH` from the demo value
- [ ] Delete the sample project and its manifest entry
- [ ] Optional: add a `favicon`, a profile photo in the hero, and your domain
