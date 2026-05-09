/**
 * Single-page application shell.
 * All routing happens client-side; the server hydrates initial user state.
 * UP-4 closure: full SEO meta + OG + Twitter card + Schema.org structured data.
 */

export function renderShell(env: any, user?: any): string {
  const initial = JSON.stringify({
    user: user || null,
    appName: env.APP_NAME || 'OASIS BI Pro',
    version: env.APP_VERSION || '3.0.0-cloudflare'
  })

  const TITLE = 'OASIS BI Pro · Sovereign Business Intelligence untuk Solopreneur Indonesia'
  const DESC = 'BI dashboard interaktif, AI-powered insights, automated reporting — dibangun di edge Cloudflare. Sovereign 100%, UU PDP 27/2022 compliant, payment via Duitku. Trial 14 hari gratis.'
  const URL = 'https://oasis-bi-pro.pages.dev'
  const OG_IMG = `${URL}/static/og-image.svg`

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OASIS BI Pro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: DESC,
    url: URL,
    publisher: {
      '@type': 'Organization',
      name: 'PT. Waskita Cakrawarti Digital',
      brand: 'SparkMind Sovereign Holding'
    },
    offers: [
      { '@type': 'Offer', name: 'Operator',  price: '99000',  priceCurrency: 'IDR' },
      { '@type': 'Offer', name: 'Sovereign', price: '299000', priceCurrency: 'IDR' },
      { '@type': 'Offer', name: 'Direktur',  price: '999000', priceCurrency: 'IDR' },
      { '@type': 'Offer', name: 'Lifetime Deal', price: '1499000', priceCurrency: 'IDR' }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '47'
    }
  }

  return `<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#7c3aed">
<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<meta name="keywords" content="business intelligence indonesia, dashboard UMKM, BI tool indonesia, dashboard penjualan, aplikasi laporan UMKM, sovereign saas, cloudflare BI, duitku integration, oasis bi pro, sparkmind">
<meta name="author" content="SparkMind Sovereign Holding">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${URL}/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:url" content="${URL}/">
<meta property="og:site_name" content="OASIS BI Pro">
<meta property="og:locale" content="id_ID">
<meta property="og:image" content="${OG_IMG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${DESC}">
<meta name="twitter:image" content="${OG_IMG}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="/static/styles.css" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/static/favicon.svg">
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
<script type="application/ld+json">${JSON.stringify(ldJson)}</script>
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
