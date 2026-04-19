// Añadir al objeto pasado a defineConfig() en vite.config.ts:
//
// import pkg from './package.json' with { type: 'json' };
//
// export default defineConfig({
//   ...
//   define: {
//     'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
//     'import.meta.env.VITE_APP_COMMIT': JSON.stringify(
//       process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
//     ),
//     'import.meta.env.VITE_APP_BUILD_TIME': JSON.stringify(new Date().toISOString()),
//   },
//   ...
// });
//
// Notas:
// - VERCEL_GIT_COMMIT_SHA lo inyecta Vercel en build. Sustituir por el equivalente de tu host:
//     Netlify → process.env.COMMIT_REF
//     Cloudflare Pages → process.env.CF_PAGES_COMMIT_SHA
//     GitHub Actions → process.env.GITHUB_SHA
// - En local no hay commit SHA de CI, por eso el fallback 'local'.
// - El import de package.json usa `with { type: 'json' }` (Node ≥20).
//   Para Node <20, cambiar a: `import pkg from './package.json' assert { type: 'json' };`
