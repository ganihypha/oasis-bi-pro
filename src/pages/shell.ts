/**
 * Single-page application shell.
 * All routing happens client-side; the server hydrates initial user state.
 */

export function renderShell(env: any, user?: any): string {
  const initial = JSON.stringify({
    user: user || null,
    appName: env.APP_NAME || 'OASIS BI Pro',
    version: env.APP_VERSION || '3.0.0-cloudflare'
  })

  return `<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OASIS BI Pro · Sovereign Business Intelligence</title>
<meta name="description" content="OASIS BI Pro — Sovereign Business Intelligence SaaS for solopreneur & micro-agency Indonesia. Powered by Cloudflare full-stack ecosystem.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="/static/styles.css" rel="stylesheet">
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          deep:    '#2a1a4a',
          deep2:   '#3d2466',
          primary: '#7c3aed',
          primarySoft: '#a78bfa',
          magenta: '#c026d3',
          gold:    '#c9a961',
          goldSoft:'#e8d9a6',
          goldDeep:'#a3873f',
          ink:     '#0f0f1e',
          paper:   '#fafafa',
          lilac:   '#f5f3ff'
        },
        fontFamily: {
          serif: ['Cormorant Garamond','serif'],
          sans:  ['Inter','sans-serif']
        }
      }
    }
  }
</script>
</head>
<body class="bg-gradient-to-br from-paper via-lilac to-paper min-h-screen font-sans text-ink antialiased">
  <div id="app"></div>
  <script>window.__INITIAL__ = ${initial};</script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <script src="/static/app.js" defer></script>
</body>
</html>`
}
