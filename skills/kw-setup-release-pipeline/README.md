# kw-setup-release-pipeline

One-shot setup of a complete release automation pipeline for Vite + React projects.

## What it does

Installs and wires up:

- **Release Please** (`googleapis/release-please-action@v4`) — automated SemVer bumps, `CHANGELOG.md`, git tags, GitHub Releases on every merge to `main`.
- **Conventional Commits** validation — Commitlint + Husky `commit-msg` hook. Bad commit messages are blocked locally.
- **Version injection at build time** — `VITE_APP_VERSION`, `VITE_APP_COMMIT`, `VITE_APP_BUILD_TIME` available via `import.meta.env`.
- **`src/lib/app-version.ts`** — typed exports for the env vars.
- **`.gitmessage`** template with allowed commit types.

After setup, every push to `main` with a `feat:` / `fix:` / `perf:` commit opens a Release PR with the version bump and changelog. Merging that PR publishes a GitHub Release with a matching tag.

## Triggers

Manual-only. Invoke with `/kw-setup-release-pipeline`.

## Arguments

None. Asks two questions (initial version, release branch) — everything else is autodetected.

## What the skill asks

1. Initial version (`1.0.0` or `0.1.0`).
2. Release branch (default `main`).

## What the skill autodetects

- Package manager (npm / pnpm / yarn / bun) from lockfile.
- CI host (Vercel / Netlify / Cloudflare Pages / GitHub Actions) from project files, to pick the right commit-SHA env var.
- Existing state of all files it would write, so it can skip or merge instead of blindly overwriting.
- Owner/repo of the GitHub remote for the checkpoint URLs.

## What the skill does NOT do

- Does not work on Next.js, Astro, Remix, or any non-Vite+React stack (aborts).
- Does not configure monorepos or Release Please manifest multi-package.
- Does not add pre-release channels, commit signing, or GPG.
- Does not modify existing CI workflows other than adding `release-please.yml`.
- Does not mount a version badge in the UI — generates the component on demand if the user asks after the core setup, adapting to the UI stack (shadcn/ui, Chakra, Mantine, Tailwind raw, etc.).

## Output

- Files created/modified in the project.
- Updated `CLAUDE.md` (if it exists) with a Conventional Commits section.
- Final checkpoint printed in chat with 3 manual steps:
  1. Enable GitHub Workflow permissions (Read and write + Allow PRs).
  2. Merge the setup branch to `main`.
  3. Verify the Release Please workflow runs green and opens the first Release PR.

## When to use

- New Vite + React project going to production.
- Existing project that still commits with free-form messages and has no versioning.
- Before shipping v1.0.0 of anything.

## Requirements

- Vite + React project.
- GitHub repo (the workflow assumes `github.com` for the remote).
- Node.js 18+ (for `husky` v9).
