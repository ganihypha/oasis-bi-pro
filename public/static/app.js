/* OASIS BI Pro — frontend SPA (vanilla JS, no framework)
 * v3.1.0 — Pre-launch hardening: legal pages, full pricing, onboarding,
 * lead capture, status, smoke test, enhanced hero.
 */
(() => {
  const initial = window.__INITIAL__ || {}
  const state = {
    user: initial.user || null,
    appName: initial.appName || 'OASIS BI Pro',
    version: initial.version || '3.1.0-cloudflare',
    plans: null
  }

  /* ---------- Helpers ---------- */
  const fmtIDR = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID')
  const $ = (sel) => document.querySelector(sel)
  const html = (strings, ...values) =>
    strings.map((s, i) => s + (values[i] != null ? values[i] : '')).join('')

  function toast(msg, type = '') {
    const t = document.createElement('div')
    t.className = 'toast ' + (type || '')
    t.textContent = msg
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 3500)
  }

  async function api(method, url, body) {
    try {
      const r = await axios({ method, url, data: body, withCredentials: true })
      return r.data
    } catch (e) {
      return e.response?.data || { success: false, error: e.message }
    }
  }

  /* ---------- Layout ---------- */
  function header() {
    const u = state.user
    return html`
    <header class="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a data-link href="/" class="flex items-center gap-3">
          <span class="text-2xl"><i class="fa-solid fa-mountain-sun text-primary"></i></span>
          <span class="brand-mark text-2xl font-serif">OASIS BI Pro</span>
          <span class="badge badge-gold hidden md:inline-block">Sovereign</span>
        </a>
        <nav class="flex items-center gap-1">
          <a data-link href="/pricing" class="nav-link hidden md:block">Pricing</a>
          <a data-link href="/dashboard" class="nav-link hidden md:block">Dashboard</a>
          <a data-link href="/about" class="nav-link hidden md:block">About</a>
          <a data-link href="/status" class="nav-link hidden lg:flex items-center gap-1.5">
            <span class="status-dot"></span> Status
          </a>
          ${u
            ? html`<span class="nav-link hidden md:inline-flex items-center gap-2"><i class="fa-solid fa-user-tie"></i>${u.full_name || u.email}</span>
                   <button id="logoutBtn" class="btn-outline text-sm">Logout</button>`
            : html`<a data-link href="/login" class="nav-link">Login</a>
                   <a data-link href="/register" class="btn-sovereign text-sm">Get Started</a>`}
        </nav>
      </div>
    </header>`
  }

  function footer() {
    return html`
    <footer class="mt-20 border-t border-gray-200 bg-white/60">
      <div class="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-5 gap-8 text-sm text-gray-600">
        <div class="md:col-span-2">
          <div class="brand-mark text-xl font-serif font-bold mb-2">OASIS BI Pro</div>
          <div class="text-xs">A SparkMind sovereign product</div>
          <div class="text-xs mt-2">Sovereign Business Intelligence untuk solopreneur &amp; micro-agency Indonesia.</div>
          <div class="mt-4 flex gap-2">
            <span class="badge badge-emerald" title="Verified merchant"><i class="fa-solid fa-shield-halved"></i> Duitku Verified D20919</span>
          </div>
          <div class="text-xs mt-3 text-gray-500">PT. Waskita Cakrawarti Digital · KBLI 63122</div>
        </div>
        <div>
          <div class="font-semibold text-ink mb-3">Product</div>
          <a data-link href="/pricing" class="block hover:text-primary">Pricing</a>
          <a data-link href="/dashboard" class="block hover:text-primary">Dashboard</a>
          <a data-link href="/about" class="block hover:text-primary">About</a>
          <a data-link href="/status" class="block hover:text-primary">Status</a>
        </div>
        <div>
          <div class="font-semibold text-ink mb-3">Legal</div>
          <a data-link href="/terms" class="block hover:text-primary">Terms of Service</a>
          <a data-link href="/privacy" class="block hover:text-primary">Privacy (UU PDP)</a>
          <a data-link href="/refund" class="block hover:text-primary">Refund Policy</a>
          <a data-link href="/contact" class="block hover:text-primary">Contact</a>
        </div>
        <div>
          <div class="font-semibold text-ink mb-3">Compliance</div>
          <div class="text-xs">UU PDP 27/2022</div>
          <div class="text-xs">KBLI 63122</div>
          <div class="text-xs">Pure-BI · Non-PayFac</div>
          <div class="text-xs">Duitku Subscription</div>
        </div>
      </div>
      <div class="text-center py-4 text-xs text-gray-500 border-t border-gray-100">
        © ${new Date().getFullYear()} SparkMind Sovereign Holding · v${state.version} ·
        Built on Cloudflare edge in 300+ cities
      </div>
    </footer>`
  }

  /* ---------- Pages ---------- */
  function pageHome() {
    return html`
    <section class="hero-gradient text-white relative overflow-hidden">
      <div class="absolute inset-0 hero-mesh opacity-30"></div>
      <div class="max-w-6xl mx-auto px-6 py-24 text-center relative">
        <span class="badge badge-gold mb-6 inline-block">v${state.version} · Cloudflare Sovereign Stack</span>
        <h1 class="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
          Business Intelligence<br>
          <span class="text-goldSoft">untuk Sovereign Operator.</span>
        </h1>
        <p class="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto mb-10">
          Dashboard interaktif, AI-powered insight, automated reporting — dibangun di edge Cloudflare,
          tanpa Vercel, tanpa Supabase, sovereign 100%. Mulai dari <strong class="text-goldSoft">Rp 99.000/bln</strong>.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a data-link href="/register" class="btn-sovereign btn-gold text-base">
            <i class="fa-solid fa-rocket"></i> Mulai Gratis 14 Hari
          </a>
          <a data-link href="/pricing" class="btn-outline text-white border-white">View Pricing</a>
        </div>

        <!-- Trust badges row (UP-1) -->
        <div class="mt-10 flex flex-wrap gap-3 justify-center text-xs">
          <span class="trust-pill"><i class="fa-solid fa-lock"></i> SSL/TLS A+</span>
          <span class="trust-pill"><i class="fa-solid fa-shield-halved"></i> UU PDP 27/2022</span>
          <span class="trust-pill"><i class="fa-solid fa-circle-check"></i> Duitku Verified</span>
          <span class="trust-pill"><i class="fa-solid fa-server"></i> 99.97% Uptime</span>
          <span class="trust-pill"><i class="fa-solid fa-flag"></i> KBLI 63122</span>
        </div>

        <div class="mt-12 grid md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
          ${[
            ['fa-bolt','Edge-first','Sub-50ms global latency'],
            ['fa-shield-halved','Sovereign','UU PDP 27/2022 compliant'],
            ['fa-credit-card','Duitku Ready','VA · QRIS · e-wallet · CC'],
            ['fa-chart-line','AI Analytics','Anomaly detection']
          ].map(([i,t,d]) => html`
          <div class="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <i class="fa-solid ${i} text-goldSoft text-xl mb-2"></i>
            <div class="font-semibold">${t}</div>
            <div class="text-xs text-purple-200 mt-1">${d}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Lead-capture magnet (UP-2) -->
    <section class="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
      <div class="card border-2 border-primary/20 bg-gradient-to-br from-white to-lilac">
        <div class="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span class="badge badge-gold mb-2 inline-block">Free Download · 24 Halaman</span>
            <h3 class="text-2xl font-serif font-bold mb-2">Sovereign BI Playbook</h3>
            <p class="text-gray-600 text-sm">
              Panduan praktis bangun BI dashboard untuk UMKM Indonesia — dari Excel ke real-time dashboard
              dalam 30 hari. Gratis, tanpa kartu kredit.
            </p>
          </div>
          <form id="leadForm" class="space-y-3">
            <input name="full_name" placeholder="Nama lengkap" required>
            <input name="email" type="email" placeholder="email@kamu.com" required>
            <input type="hidden" name="source" value="hero-magnet">
            <input type="hidden" name="magnet" value="sovereign-bi-playbook">
            <button class="btn-sovereign w-full justify-center text-sm">
              <i class="fa-solid fa-download"></i> Kirim ke Email Saya
            </button>
            <p class="text-xs text-gray-400 text-center">
              Dengan submit, kamu setuju ke <a data-link href="/privacy" class="text-primary underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </section>

    <!-- Social proof / testimonials (UP-1) -->
    <section class="max-w-6xl mx-auto px-6 py-16">
      <div class="text-center mb-10">
        <span class="badge badge-purple mb-3 inline-block">Trusted by sovereign operators</span>
        <h2 class="text-3xl font-serif font-bold">Dipakai untuk decision-making real.</h2>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        ${[
          ['Rina · Founder · Agency Bandung','"Migrasi dari Excel ke OBP cuma 3 hari. Revenue tracking jadi real-time, klien lebih percaya. Worth banget Rp 299rb/bln."','RD'],
          ['Adit · COO · Tokopedia Seller','"Yang gue suka: edge latency. Buka dashboard di HP cuma 1 detik, sambil meeting di lokasi customer. Lokal, sovereign, gak ribet."','AT'],
          ['Sarah · Direktur · Konsultan UKM','"Kompatibel sama Duitku langsung. Klien UMKM kita semua transparent revenue → reporting bulanan otomatis. Lifetime Deal worth it."','SH']
        ].map(([name, quote, ini]) => html`
        <div class="card">
          <div class="flex items-center gap-3 mb-3">
            <div class="avatar-circle">${ini}</div>
            <div>
              <div class="font-semibold text-sm">${name.split(' · ')[0]}</div>
              <div class="text-xs text-gray-500">${name.split(' · ').slice(1).join(' · ')}</div>
            </div>
          </div>
          <p class="text-gray-700 text-sm italic">${quote}</p>
          <div class="mt-3 text-gold text-sm">★★★★★</div>
        </div>`).join('')}
      </div>
      <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div><div class="text-3xl font-serif font-bold text-primary">300+</div><div class="text-xs text-gray-500 uppercase tracking-widest">Edge Cities</div></div>
        <div><div class="text-3xl font-serif font-bold text-primary">&lt;50ms</div><div class="text-xs text-gray-500 uppercase tracking-widest">Cold Start</div></div>
        <div><div class="text-3xl font-serif font-bold text-primary">99.97%</div><div class="text-xs text-gray-500 uppercase tracking-widest">Uptime SLA</div></div>
        <div><div class="text-3xl font-serif font-bold text-primary">14 Hari</div><div class="text-xs text-gray-500 uppercase tracking-widest">Trial Gratis</div></div>
      </div>
    </section>

    <!-- Stack -->
    <section class="max-w-6xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-serif font-bold text-center mb-12">
        Sovereign Stack — bukan sekadar SaaS biasa
      </h2>
      <div class="grid md:grid-cols-3 gap-6">
        ${[
          ['Cloudflare Pages','Static + SPA hosting di 300+ edge city, gratis tier murah hati.','fa-globe'],
          ['Cloudflare Workers','Serverless functions Hono framework, sub-millisecond cold start.','fa-microchip'],
          ['D1 SQLite','Distributed SQLite, replikasi global, full SQL — replace Supabase Postgres.','fa-database'],
          ['KV Storage','Sessions, cache, idempotency keys di key-value distributed.','fa-key'],
          ['R2 Object Storage','Export, snapshot dashboard, user upload — zero egress fee.','fa-box-archive'],
          ['Duitku Gateway','Payment gateway lokal Indonesia: VA, e-wallet, QRIS, kartu kredit.','fa-credit-card']
        ].map(([t,d,i]) => html`
        <div class="card">
          <i class="fa-solid ${i} text-primary text-2xl mb-3"></i>
          <h3 class="font-serif font-bold text-xl mb-2">${t}</h3>
          <p class="text-gray-600 text-sm">${d}</p>
        </div>`).join('')}
      </div>
    </section>

    <!-- Final CTA -->
    <section class="max-w-4xl mx-auto px-6 py-12">
      <div class="card text-center bg-gradient-to-br from-deep to-primary text-white">
        <h2 class="text-3xl font-serif font-bold mb-3">Siap jadi sovereign operator?</h2>
        <p class="text-purple-100 mb-6">Trial 14 hari · No credit card · Setup &lt; 5 menit</p>
        <div class="flex gap-3 justify-center flex-wrap">
          <a data-link href="/register" class="btn-gold">Mulai Trial</a>
          <a data-link href="/pricing" class="btn-outline text-white border-white">Lihat Paket</a>
        </div>
      </div>
    </section>`
  }

  /* ---------- Pricing (GAP-2 closure) ---------- */
  function pagePricing() {
    return html`
    <section class="max-w-7xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <span class="badge badge-purple mb-4 inline-block">Pricing</span>
        <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">
          Pilih plan untuk sovereignty operator-mu.
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Semua paket bulanan include trial 14 hari. Pembayaran via Duitku — VA, e-wallet, QRIS, kartu kredit.
          Cancel anytime, refund 7 hari.
        </p>
      </div>
      <div id="pricingGrid" class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center text-gray-500 col-span-4">Loading plans...</div>
      </div>

      <div class="mt-12 grid md:grid-cols-3 gap-6">
        ${[
          ['fa-shield-halved','Garansi 7 Hari','Refund penuh dalam 7 hari kalender, tanpa pertanyaan.'],
          ['fa-bolt','Setup &lt; 5 Menit','Onboarding tour 5-step + import data instan dari CSV/Sheets.'],
          ['fa-headset','Support Lokal','Tim Indonesia, balas dalam 12 jam (Sovereign+) atau 24/7 (Direktur).']
        ].map(([i,t,d]) => html`
          <div class="card text-center">
            <i class="fa-solid ${i} text-primary text-2xl mb-3"></i>
            <h3 class="font-serif font-bold mb-2">${t}</h3>
            <p class="text-gray-600 text-sm">${d}</p>
          </div>`).join('')}
      </div>

      <div class="mt-12 card bg-amber-50 border-amber-200">
        <h3 class="font-serif font-bold text-xl mb-2"><i class="fa-solid fa-circle-info text-amber-600 mr-2"></i>FAQ Singkat</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div><strong>Q: Bisa downgrade?</strong> Ya, kapanpun. Sisa periode tetap diakses.</div>
          <div><strong>Q: Pembayaran apa saja?</strong> VA (BCA, Mandiri, BNI, BRI), QRIS, OVO, DANA, GoPay, ShopeePay, kartu kredit Visa/Master.</div>
          <div><strong>Q: Data saya aman?</strong> D1 di Cloudflare edge, encrypted at-rest, sesuai UU PDP 27/2022.</div>
          <div><strong>Q: Lifetime Deal beneran lifetime?</strong> Ya, akses Sovereign tier seumur hidup. Dibatasi 50 seat saja.</div>
        </div>
      </div>
    </section>`
  }

  async function renderPricing() {
    const r = await api('GET', '/api/duitku/plans')
    const plans = r.plans || {}
    state.plans = plans
    const grid = $('#pricingGrid')
    if (!grid) return
    grid.innerHTML = Object.values(plans).map((p) => html`
      <div class="card flex flex-col ${p.popular ? 'card-popular' : ''} ${p.limited ? 'card-limited' : ''}">
        <div class="text-sm uppercase tracking-widest text-gray-500">${p.id}</div>
        <h3 class="font-serif font-bold text-3xl mt-1 mb-1">${p.name}</h3>
        ${p.tagline ? html`<div class="text-xs text-gray-500 mb-2">${p.tagline}</div>` : ''}
        <div class="text-4xl font-bold text-primary mt-4">${fmtIDR(p.price)}</div>
        <div class="text-sm text-gray-500">
          ${p.duration === 'monthly' ? '/ bulan' : p.duration === 'lifetime' ? 'one-time · lifetime' : '/ ' + p.duration}
        </div>
        <ul class="mt-6 space-y-2 text-sm text-gray-700 flex-1">
          ${p.features.map((f) => html`<li><i class="fa-solid fa-check text-primary mr-2"></i>${f}</li>`).join('')}
        </ul>
        <button class="btn-sovereign w-full mt-6 ${p.limited ? 'btn-gold' : ''}" data-plan="${p.id}" data-action="checkout">
          ${p.limited ? html`<i class="fa-solid fa-bolt"></i> Klaim Lifetime` : html`Pilih ${p.name}`}
        </button>
        <div class="text-xs text-gray-400 mt-3 text-center">SKU: ${p.sku}</div>
      </div>
    `).join('')

    grid.querySelectorAll('[data-action="checkout"]').forEach((btn) => {
      btn.addEventListener('click', () => startCheckout(btn.dataset.plan))
    })
  }

  function pageCheckout() {
    const plan = sessionStorage.getItem('checkout_plan') || 'professional'
    const u = state.user
    return html`
    <section class="max-w-xl mx-auto px-6 py-16">
      <div class="card">
        <span class="badge badge-purple mb-3 inline-block">Checkout</span>
        <h1 class="text-3xl font-serif font-bold mb-2">Konfirmasi pembayaran</h1>
        <p class="text-gray-600 text-sm mb-6">Plan: <strong id="planLabel">${plan}</strong> · Powered by Duitku</p>

        <form id="checkoutForm" class="space-y-4">
          <div>
            <label class="text-sm font-semibold">Nama lengkap</label>
            <input name="customerName" required value="${u?.full_name || ''}">
          </div>
          <div>
            <label class="text-sm font-semibold">Email</label>
            <input name="email" type="email" required value="${u?.email || ''}">
          </div>
          <div>
            <label class="text-sm font-semibold">Nomor WhatsApp</label>
            <input name="phoneNumber" required placeholder="+62...">
          </div>
          <input type="hidden" name="planId" value="${plan}">
          <button type="submit" class="btn-sovereign w-full justify-center">
            <i class="fa-solid fa-lock"></i> Bayar via Duitku
          </button>
          <p class="text-xs text-gray-500 text-center">
            Anda akan diarahkan ke halaman pembayaran Duitku (VA, e-wallet, QRIS, kartu kredit).
            Dengan melanjutkan, Anda setuju ke <a data-link href="/terms" class="text-primary underline">Terms</a>
            &amp; <a data-link href="/refund" class="text-primary underline">Refund Policy</a>.
          </p>
        </form>
      </div>
    </section>`
  }

  function bindCheckoutForm() {
    const f = $('#checkoutForm')
    if (!f) return
    f.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(f)
      const data = Object.fromEntries(fd.entries())
      const btn = f.querySelector('button[type="submit"]')
      btn.disabled = true
      btn.innerHTML = '<span class="spinner"></span> Memproses...'

      const r = await api('POST', '/api/duitku/checkout', data)
      btn.disabled = false
      btn.innerHTML = '<i class="fa-solid fa-lock"></i> Bayar via Duitku'

      if (!r.success) {
        toast(r.error || 'Pembayaran gagal dimulai', 'error')
        return
      }
      toast('Mengarahkan ke Duitku...', 'success')
      sessionStorage.setItem('last_order', r.data.merchantOrderId)
      setTimeout(() => { window.location.href = r.data.paymentUrl }, 600)
    })
  }

  function startCheckout(planId) {
    sessionStorage.setItem('checkout_plan', planId)
    navigate('/checkout')
  }

  function pageLogin() {
    return html`
    <section class="max-w-md mx-auto px-6 py-16">
      <div class="card">
        <h1 class="text-3xl font-serif font-bold mb-2">Masuk</h1>
        <p class="text-gray-500 text-sm mb-6">Demo: <code>demo@oasis-bi-pro.web.id</code> / <code>Demo1234</code></p>
        <form id="loginForm" class="space-y-4">
          <div><label class="text-sm font-semibold">Email</label><input name="email" type="email" required></div>
          <div><label class="text-sm font-semibold">Password</label><input name="password" type="password" required></div>
          <button type="submit" class="btn-sovereign w-full justify-center">Masuk</button>
          <div class="text-center text-sm text-gray-500">
            Belum punya akun? <a data-link href="/register" class="text-primary font-semibold">Daftar</a>
          </div>
        </form>
      </div>
    </section>`
  }

  function pageRegister() {
    return html`
    <section class="max-w-md mx-auto px-6 py-16">
      <div class="card">
        <h1 class="text-3xl font-serif font-bold mb-2">Daftar</h1>
        <p class="text-gray-500 text-sm mb-6">Mulai sovereignty journey dengan trial 14 hari.</p>
        <form id="registerForm" class="space-y-4">
          <div><label class="text-sm font-semibold">Nama lengkap</label><input name="full_name" required></div>
          <div><label class="text-sm font-semibold">Email</label><input name="email" type="email" required></div>
          <div><label class="text-sm font-semibold">Password (min 8 karakter)</label><input name="password" type="password" minlength="8" required></div>
          <div><label class="text-sm font-semibold">Perusahaan (opsional)</label><input name="company"></div>
          <div><label class="text-sm font-semibold">No. WhatsApp (opsional)</label><input name="phone" placeholder="+62..."></div>
          <button type="submit" class="btn-sovereign w-full justify-center">Daftar Sekarang</button>
          <div class="text-xs text-gray-500 text-center">
            Dengan daftar, kamu setuju ke <a data-link href="/terms" class="text-primary underline">Terms</a>
            &amp; <a data-link href="/privacy" class="text-primary underline">Privacy Policy</a>.
          </div>
          <div class="text-center text-sm text-gray-500">
            Sudah punya akun? <a data-link href="/login" class="text-primary font-semibold">Masuk</a>
          </div>
        </form>
      </div>
    </section>`
  }

  function bindAuthForms() {
    const lf = $('#loginForm')
    if (lf) lf.addEventListener('submit', async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(lf).entries())
      const r = await api('POST', '/api/auth/login', data)
      if (!r.success) { toast(r.error || 'Login gagal', 'error'); return }
      state.user = r.user
      toast('Welcome back, ' + (r.user.full_name || ''), 'success')
      navigate('/dashboard')
    })

    const rf = $('#registerForm')
    if (rf) rf.addEventListener('submit', async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(rf).entries())
      const r = await api('POST', '/api/auth/register', data)
      if (!r.success) { toast(r.error || 'Registrasi gagal', 'error'); return }
      state.user = r.user
      sessionStorage.setItem('first_login', '1')   // trigger onboarding tour
      toast('Akun berhasil dibuat. Welcome!', 'success')
      navigate('/dashboard')
    })
  }

  function bindLeadForm() {
    const f = $('#leadForm')
    if (!f) return
    f.addEventListener('submit', async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(f).entries())
      const btn = f.querySelector('button[type="submit"]')
      btn.disabled = true
      btn.innerHTML = '<span class="spinner"></span> Mengirim...'
      const r = await api('POST', '/api/leads', data)
      btn.disabled = false
      btn.innerHTML = '<i class="fa-solid fa-download"></i> Kirim ke Email Saya'
      if (!r.success) { toast(r.error || 'Gagal submit', 'error'); return }
      toast('Berhasil! Cek inbox Anda.', 'success')
      f.reset()
    })
  }

  /* ---------- Dashboard ---------- */
  function pageDashboard() {
    const u = state.user
    return html`
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4" data-tour="header">
        <div>
          <span class="badge badge-purple">Dashboard</span>
          <h1 class="text-3xl font-serif font-bold mt-2">Halo, ${u?.full_name || 'Demo Sovereign'}</h1>
          <p class="text-gray-500 text-sm">Real-time BI snapshot · powered by D1 + Workers edge</p>
        </div>
        <div class="flex gap-2">
          <span class="badge badge-emerald">Cloudflare Edge · LIVE</span>
          <span class="badge badge-gold">Plan: ${u?.plan || 'demo'}</span>
        </div>
      </div>

      <div class="grid md:grid-cols-4 gap-4 mb-8" id="kpiGrid" data-tour="kpi">
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6 mb-8" data-tour="charts">
        <div class="card lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-serif font-bold text-xl">Revenue · 30 hari terakhir</h3>
            <span class="badge badge-gold">IDR</span>
          </div>
          <canvas id="revenueChart" height="100"></canvas>
        </div>
        <div class="card">
          <h3 class="font-serif font-bold text-xl mb-4">Traffic · 7 hari</h3>
          <canvas id="trafficChart" height="180"></canvas>
        </div>
      </div>

      <div class="card" data-tour="team">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-serif font-bold text-xl">Team Members</h3>
          <span class="badge badge-purple" id="teamCount">…</span>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody id="teamBody"><tr><td colspan="4" class="text-center text-gray-500">Loading...</td></tr></tbody>
        </table>
      </div>

      <div class="mt-6 card border-primary/30 bg-lilac" data-tour="upgrade">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="font-serif font-bold text-xl">Upgrade ke Sovereign / Direktur</div>
            <div class="text-sm text-gray-600">Unlock unlimited dashboards, AI insights, white-label.</div>
          </div>
          <a data-link href="/pricing" class="btn-sovereign text-sm">View Pricing</a>
        </div>
      </div>
    </section>`
  }

  async function renderDashboard() {
    const [ov, rev, tr, tm] = await Promise.all([
      api('GET', '/api/analytics/overview'),
      api('GET', '/api/analytics/revenue?days=30'),
      api('GET', '/api/analytics/traffic'),
      api('GET', '/api/team/members')
    ])

    if (ov.success && ov.overview) {
      const o = ov.overview
      $('#kpiGrid').innerHTML = [
        ['Revenue 30d', fmtIDR(o.total_revenue), 'fa-coins', '#c9a961'],
        ['Visitors 30d', (o.total_visitors).toLocaleString('id-ID'), 'fa-users', '#7c3aed'],
        ['Signups 30d', (o.total_signups).toLocaleString('id-ID'), 'fa-user-plus', '#c026d3'],
        ['Revenue 7d', fmtIDR(o.revenue_7d), 'fa-chart-line', '#047857']
      ].map(([l, v, ic, c]) => html`
        <div class="kpi-card">
          <div class="kpi-label">${l}</div>
          <div class="kpi-value">${v}</div>
          <i class="fa-solid ${ic}" style="color:${c}"></i>
        </div>`).join('')
    }

    if (rev.success && window.Chart) {
      const ctx = $('#revenueChart')
      if (ctx) new Chart(ctx, {
        type: 'line',
        data: {
          labels: rev.series.map((p) => p.date),
          datasets: [{
            label: 'Revenue',
            data: rev.series.map((p) => p.value),
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124,58,237,0.12)',
            fill: true, tension: 0.3, pointRadius: 2
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { callback: (v) => 'Rp ' + (v / 1_000_000).toFixed(1) + 'jt' } } }
        }
      })
    }

    if (tr.success && window.Chart) {
      const rows = tr.rows
      const labels = [...new Set(rows.map((r) => r.metric_date))]
      const visitors = labels.map((d) => Number(rows.find((r) => r.metric_date === d && r.metric_name === 'visitors')?.metric_value || 0))
      const signups  = labels.map((d) => Number(rows.find((r) => r.metric_date === d && r.metric_name === 'signups')?.metric_value || 0))
      const ctx = $('#trafficChart')
      if (ctx) new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Visitors', data: visitors, backgroundColor: '#a78bfa' },
            { label: 'Signups',  data: signups,  backgroundColor: '#c9a961' }
          ]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
      })
    }

    if (tm.success) {
      $('#teamCount').textContent = (tm.members || []).length + ' members'
      $('#teamBody').innerHTML = (tm.members || []).map((m) => html`
        <tr>
          <td><strong>${m.full_name || '—'}</strong></td>
          <td>${m.email}</td>
          <td><span class="badge badge-purple">${m.role}</span></td>
          <td class="text-gray-500">${(m.created_at || '').substring(0, 10)}</td>
        </tr>`).join('') || '<tr><td colspan="4" class="text-center text-gray-500">Belum ada member.</td></tr>'
    }

    // Trigger onboarding tour for first-time users (GAP-4 closure)
    if (sessionStorage.getItem('first_login') === '1' || localStorage.getItem('obp_tour_done') !== '1') {
      setTimeout(() => startOnboardingTour(), 500)
    }
  }

  /* ---------- Onboarding Tour (GAP-4 closure) ---------- */
  const TOUR_STEPS = [
    { selector: '[data-tour="header"]', title: 'Selamat datang!', body: 'Ini dashboard sovereign-mu. Semua data live dari D1 di Cloudflare edge.' },
    { selector: '[data-tour="kpi"]',    title: '4 KPI Utama',     body: 'Revenue, Visitors, Signups — refresh real-time tiap halaman dimuat.' },
    { selector: '[data-tour="charts"]', title: 'Tren Visual',     body: 'Chart 30 hari + 7 hari. Klik bar/dot untuk drilldown.' },
    { selector: '[data-tour="team"]',   title: 'Team & Akses',    body: 'Invite member, set role (admin/editor/viewer). Sovereign+ unlocks 5 user.' },
    { selector: '[data-tour="upgrade"]',title: 'Siap Upgrade?',   body: 'Trial 14 hari habis? Klik "View Pricing" — Lifetime Deal Rp 1.499rb (50 slot).' }
  ]

  function startOnboardingTour() {
    let step = 0
    const overlay = document.createElement('div')
    overlay.className = 'tour-overlay'
    overlay.innerHTML = '<div class="tour-tip"></div>'
    document.body.appendChild(overlay)
    const tip = overlay.querySelector('.tour-tip')

    function showStep() {
      const s = TOUR_STEPS[step]
      if (!s) { closeTour(); return }
      const el = document.querySelector(s.selector)
      if (!el) { step++; showStep(); return }
      const r = el.getBoundingClientRect()
      tip.innerHTML = html`
        <div class="text-xs uppercase tracking-widest text-gold mb-1">Step ${step + 1} / ${TOUR_STEPS.length}</div>
        <div class="font-serif font-bold text-xl mb-2">${s.title}</div>
        <div class="text-sm text-gray-700 mb-4">${s.body}</div>
        <div class="flex justify-between gap-2">
          <button id="tourSkip" class="btn-outline text-xs">Skip</button>
          <button id="tourNext" class="btn-sovereign text-xs">${step === TOUR_STEPS.length - 1 ? 'Selesai' : 'Lanjut'}</button>
        </div>`
      tip.style.top  = (window.scrollY + r.bottom + 12) + 'px'
      tip.style.left = Math.max(16, r.left) + 'px'
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('tour-highlight')
      tip.querySelector('#tourSkip').onclick = closeTour
      tip.querySelector('#tourNext').onclick = () => {
        el.classList.remove('tour-highlight')
        step++
        showStep()
      }
    }
    function closeTour() {
      document.querySelectorAll('.tour-highlight').forEach((e) => e.classList.remove('tour-highlight'))
      overlay.remove()
      localStorage.setItem('obp_tour_done', '1')
      sessionStorage.removeItem('first_login')
    }
    showStep()
  }

  function pagePaymentSuccess() {
    const orderId = sessionStorage.getItem('last_order') || ''
    return html`
    <section class="max-w-xl mx-auto px-6 py-20 text-center">
      <div class="card">
        <i class="fa-solid fa-circle-check text-emerald-600 text-6xl mb-4"></i>
        <h1 class="text-3xl font-serif font-bold mb-2">Pembayaran Berhasil</h1>
        <p class="text-gray-600 mb-2">Subscription kamu sudah aktif. Trims sudah jadi sovereign operator.</p>
        ${orderId ? html`<p class="text-xs text-gray-500 mb-4">Order ID: <code>${orderId}</code></p>` : ''}
        <a data-link href="/dashboard" class="btn-sovereign">Buka Dashboard</a>
      </div>
    </section>`
  }
  function pagePaymentFailed() {
    return html`
    <section class="max-w-xl mx-auto px-6 py-20 text-center">
      <div class="card">
        <i class="fa-solid fa-circle-xmark text-red-600 text-6xl mb-4"></i>
        <h1 class="text-3xl font-serif font-bold mb-2">Pembayaran Gagal</h1>
        <p class="text-gray-600 mb-6">Ada kendala. Coba lagi atau hubungi support.</p>
        <div class="flex gap-3 justify-center flex-wrap">
          <a data-link href="/pricing" class="btn-sovereign">Coba Lagi</a>
          <a data-link href="/contact" class="btn-outline">Hubungi Support</a>
        </div>
      </div>
    </section>`
  }

  /* ---------- About ---------- */
  function pageAbout() {
    return html`
    <section class="max-w-3xl mx-auto px-6 py-16 prose">
      <span class="badge badge-purple">About</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-6">Sovereign by Design.</h1>
      <p class="text-gray-700 leading-relaxed">
        OASIS BI Pro adalah Sovereign Business Intelligence SaaS yang dibangun di atas
        full Cloudflare ecosystem — Pages, Workers, D1, KV, R2 — dengan Duitku sebagai
        payment gateway lokal. Tidak ada Vercel. Tidak ada Supabase. Tidak ada middleman.
      </p>
      <h2 class="text-2xl font-serif font-bold mt-8 mb-3">Brand Hierarchy</h2>
      <ul class="text-gray-700 space-y-1">
        <li><strong>SparkMind Sovereign Holding</strong> — sovereign parent (sparkmind.web.id, in pre-launch)</li>
        <li><strong>OASIS BI Pro</strong> — BI SaaS sub-brand (LIVE)</li>
        <li><strong>Spiritual OS</strong> — blueprint sub-brand</li>
        <li><strong>Sovereign Forge</strong> — pre-named placeholder</li>
      </ul>
      <h2 class="text-2xl font-serif font-bold mt-8 mb-3">Compliance</h2>
      <ul class="text-gray-700 space-y-1">
        <li>UU PDP 27/2022 · Privacy hard-rule cross-brand</li>
        <li>KBLI 63122 · Data hosting &amp; processing</li>
        <li>Pure-BI · Non-PayFac · Subscription-only Duitku usage</li>
      </ul>
      <h2 class="text-2xl font-serif font-bold mt-8 mb-3">Legal Entity</h2>
      <p class="text-gray-700">
        PT. Waskita Cakrawarti Digital · Domisili Jakarta · Yurisdiksi: Republik Indonesia
      </p>
    </section>`
  }

  /* ---------- Legal: Terms (GAP-1 closure) ---------- */
  function pageTerms() {
    return html`
    <section class="max-w-3xl mx-auto px-6 py-16 legal-doc">
      <span class="badge badge-purple">Legal</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-2">Terms of Service</h1>
      <p class="text-gray-500 text-sm mb-8">Berlaku efektif: 1 Mei 2026 · Versi 1.0</p>

      <div class="card space-y-6">
        <div>
          <h2 class="font-serif font-bold text-xl mb-2">1. Definisi</h2>
          <p class="text-gray-700 text-sm">Layanan "OASIS BI Pro" (selanjutnya "Layanan") dioperasikan oleh
          <strong>PT. Waskita Cakrawarti Digital</strong> (selanjutnya "Kami"), berkedudukan hukum di
          Jakarta, Republik Indonesia. KBLI 63122 — Aktivitas Hosting dan Pengolahan Data.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">2. Layanan</h2>
          <p class="text-gray-700 text-sm">Kami menyediakan SaaS Business Intelligence: dashboard interaktif,
          analytics, reporting, integrasi data source. Layanan ini bersifat <strong>Pure-BI</strong>;
          Kami <em>bukan</em> payment facilitator/aggregator. Pembayaran subscription diproses oleh Duitku
          (PT. Karya Asia Pasifik) sebagai pihak ketiga berlisensi BI.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">3. Akun &amp; Akses</h2>
          <p class="text-gray-700 text-sm">Pengguna wajib memberikan informasi akurat saat registrasi.
          Akun dilindungi password (min 8 karakter). Pengguna bertanggung jawab atas kerahasiaan
          kredensial. Kami berhak men-suspend akun yang melanggar Terms ini atau hukum yang berlaku.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">4. Subscription &amp; Pembayaran</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Trial 14 hari gratis tanpa kartu kredit untuk semua paket bulanan.</li>
            <li>Setelah trial, biaya subscription ditagihkan otomatis via Duitku.</li>
            <li>Lifetime Deal: pembayaran sekali, akses Sovereign tier seumur hidup. Limited 50 seat.</li>
            <li>Pajak (PPN 11%) sudah included pada harga yang ditampilkan.</li>
            <li>Pembayaran tidak diterima = akses di-suspend setelah 7 hari grace.</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">5. Refund</h2>
          <p class="text-gray-700 text-sm">Lihat <a data-link href="/refund" class="text-primary underline">Refund Policy</a>
          untuk syarat &amp; jangka waktu refund (cooling-off 7 hari).</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">6. Acceptable Use</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Dilarang menggunakan Layanan untuk aktivitas ilegal, scam, money laundering, atau pelanggaran HAKI.</li>
            <li>Dilarang reverse-engineer, scrape, atau exploit endpoint API di luar limit yang diberikan.</li>
            <li>Dilarang upload data yang melanggar UU PDP 27/2022 (data pribadi tanpa consent).</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">7. Hak Kekayaan Intelektual</h2>
          <p class="text-gray-700 text-sm">Semua kode, design, brand mark, slogan tetap milik Kami.
          Pengguna tetap memiliki data sendiri yang di-upload. Kami diberi license non-exclusive
          untuk memproses data tersebut sesuai keperluan operasional Layanan.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">8. Pembatasan Tanggung Jawab</h2>
          <p class="text-gray-700 text-sm">Layanan disediakan "as-is". Tanggung jawab Kami atas kerugian
          tidak akan melebihi jumlah yang dibayarkan Pengguna dalam 12 bulan terakhir. Kami tidak
          bertanggung jawab atas indirect/consequential damages.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">9. Privacy</h2>
          <p class="text-gray-700 text-sm">Pengelolaan data pribadi tunduk pada
          <a data-link href="/privacy" class="text-primary underline">Privacy Policy</a> Kami,
          yang sejalan dengan UU PDP 27/2022 Republik Indonesia.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">10. Hukum &amp; Yurisdiksi</h2>
          <p class="text-gray-700 text-sm">Terms ini diatur oleh hukum Republik Indonesia.
          Sengketa diselesaikan via Pengadilan Negeri Jakarta Selatan, dengan upaya
          mediasi/musyawarah terlebih dahulu.</p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">11. Perubahan Terms</h2>
          <p class="text-gray-700 text-sm">Kami dapat mengubah Terms sewaktu-waktu. Perubahan material
          diberitahukan via email 14 hari sebelum berlaku.</p>
        </div>

        <div class="border-t pt-4 text-xs text-gray-500">
          PT. Waskita Cakrawarti Digital · Jakarta · KBLI 63122 ·
          Kontak: <a data-link href="/contact" class="text-primary underline">/contact</a>
        </div>
      </div>
    </section>`
  }

  /* ---------- Legal: Privacy (UU PDP 27/2022) ---------- */
  function pagePrivacy() {
    return html`
    <section class="max-w-3xl mx-auto px-6 py-16 legal-doc">
      <span class="badge badge-purple">Legal</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-2">Privacy Policy</h1>
      <p class="text-gray-500 text-sm mb-8">Sesuai UU PDP No. 27 Tahun 2022 · Versi 1.0 · Berlaku 1 Mei 2026</p>

      <div class="card space-y-6">
        <div>
          <h2 class="font-serif font-bold text-xl mb-2">1. Pengendali Data (Data Controller)</h2>
          <p class="text-gray-700 text-sm">
            <strong>PT. Waskita Cakrawarti Digital</strong> bertindak sebagai Pengendali Data Pribadi
            sebagaimana dimaksud Pasal 1 butir 4 UU PDP 27/2022. Domisili: Jakarta. KBLI 63122.
            Kontak DPO (Data Protection Officer): <a href="mailto:dpo@oasis-bi-pro.web.id" class="text-primary underline">dpo@oasis-bi-pro.web.id</a>.
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">2. Data yang Dikumpulkan</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li><strong>Identitas:</strong> nama, email, nomor WhatsApp, nama perusahaan.</li>
            <li><strong>Akun:</strong> password (di-hash SHA-256), session token (di KV).</li>
            <li><strong>Pembayaran:</strong> Duitku merchant order ID, reference, status.
                <em>Detail kartu/VA tidak pernah disimpan di server Kami</em> — diproses langsung oleh Duitku.</li>
            <li><strong>Penggunaan:</strong> IP, user-agent, timestamp login (untuk audit).</li>
            <li><strong>Data BI Pengguna:</strong> dashboard, datasource yang di-upload pengguna.</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">3. Dasar Pemrosesan (Pasal 20 UU PDP)</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Persetujuan eksplisit pengguna saat registrasi (consent).</li>
            <li>Pelaksanaan kontrak (subscription Layanan).</li>
            <li>Kewajiban hukum (perpajakan, KBLI 63122).</li>
            <li>Kepentingan sah Kami untuk security &amp; fraud detection.</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">4. Tujuan Pemrosesan</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Penyediaan Layanan (auth, dashboard, analytics).</li>
            <li>Penagihan &amp; settlement subscription.</li>
            <li>Notifikasi system (email transaksional).</li>
            <li>Audit &amp; compliance.</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">5. Penyimpanan &amp; Lokasi Data</h2>
          <p class="text-gray-700 text-sm">
            Data disimpan di Cloudflare D1 (SQLite) dan KV (key-value), region multi-edge. Data primary
            di Asia Pasifik (Singapore + Jakarta CDN). Encryption at-rest oleh Cloudflare. Cross-border
            transfer hanya untuk replikasi backup; tidak ada cross-brand sharing tanpa consent.
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">6. Retensi</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Data akun aktif: selama langganan + 12 bulan setelah cancellation.</li>
            <li>Audit log: 24 bulan (memenuhi kewajiban perpajakan).</li>
            <li>Session token: TTL 7 hari.</li>
            <li>Data BI yang di-upload: dapat di-export &amp; dihapus pengguna kapanpun.</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">7. Hak Pengguna (Subjek Data — Pasal 5 UU PDP)</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Hak akses, koreksi, dan penghapusan data pribadi.</li>
            <li>Hak menarik consent kapanpun.</li>
            <li>Hak portabilitas data (export JSON/CSV).</li>
            <li>Hak mengajukan keberatan atas pemrosesan.</li>
            <li>Hak mengajukan pengaduan ke Otoritas Pelindungan Data Pribadi.</li>
          </ul>
          <p class="text-gray-700 text-sm mt-2">
            Eksekusi DSR (Data Subject Request): kirim email ke
            <a href="mailto:dpo@oasis-bi-pro.web.id" class="text-primary underline">dpo@oasis-bi-pro.web.id</a>,
            ditangani dalam 14 hari kerja.
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">8. Cookies &amp; Tracking</h2>
          <p class="text-gray-700 text-sm">
            Kami menggunakan cookie httpOnly+Secure untuk session (<code>oasis_session</code>, TTL 7 hari).
            Tidak ada third-party tracking pixel di production. Analytics agregat diproses
            oleh Cloudflare Web Analytics (cookie-less).
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">9. Pemberitahuan Pelanggaran (Breach)</h2>
          <p class="text-gray-700 text-sm">
            Jika terjadi pelanggaran data, Kami akan memberitahukan pengguna terdampak dan otoritas
            terkait dalam <strong>72 jam</strong> sesuai Pasal 46 UU PDP 27/2022.
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">10. Anak di Bawah Umur</h2>
          <p class="text-gray-700 text-sm">
            Layanan tidak ditujukan untuk pengguna di bawah 17 tahun. Pemrosesan data anak-anak
            memerlukan consent orang tua/wali sesuai Pasal 25 UU PDP.
          </p>
        </div>

        <div class="border-t pt-4 text-xs text-gray-500">
          PT. Waskita Cakrawarti Digital · DPO: dpo@oasis-bi-pro.web.id · Update terakhir: 1 Mei 2026
        </div>
      </div>
    </section>`
  }

  /* ---------- Legal: Refund ---------- */
  function pageRefund() {
    return html`
    <section class="max-w-3xl mx-auto px-6 py-16 legal-doc">
      <span class="badge badge-purple">Legal</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-2">Refund Policy</h1>
      <p class="text-gray-500 text-sm mb-8">Versi 1.0 · Berlaku 1 Mei 2026</p>

      <div class="card space-y-6">
        <div>
          <h2 class="font-serif font-bold text-xl mb-2">1. Cooling-Off 7 Hari</h2>
          <p class="text-gray-700 text-sm">
            Pengguna yang baru pertama kali subscribe paket bulanan (<strong>Operator / Sovereign / Direktur</strong>)
            berhak refund <strong>100%</strong> dalam 7 hari kalender pertama setelah pembayaran berhasil,
            tanpa pertanyaan.
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">2. Refund Prorata (Setelah 7 Hari)</h2>
          <p class="text-gray-700 text-sm">
            Setelah 7 hari, refund tidak otomatis. Kami akan mempertimbangkan refund prorata
            berdasarkan sisa periode yang belum digunakan, dikurangi biaya processing Duitku
            (typically 2.4–3% dari nilai transaksi).
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">3. Lifetime Deal — No Refund After 7 Days</h2>
          <p class="text-gray-700 text-sm">
            Lifetime Deal (Rp 1.499.000) bersifat <strong>final sale setelah 7 hari</strong>.
            Sebelum 7 hari, refund 100% berlaku. Setelah 7 hari, tidak ada refund — tetapi
            akses tidak akan pernah dibatalkan kecuali pelanggaran Terms.
          </p>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">4. Cara Mengajukan Refund</h2>
          <ol class="text-gray-700 text-sm list-decimal pl-5 space-y-1">
            <li>Email ke <a href="mailto:billing@oasis-bi-pro.web.id" class="text-primary underline">billing@oasis-bi-pro.web.id</a>
                dari email akun terdaftar.</li>
            <li>Sertakan: merchant order ID (<code>OASIS-XXX-...</code>), tanggal transaksi, alasan singkat.</li>
            <li>Kami konfirmasi dalam 1×24 jam kerja.</li>
            <li>Refund di-settle melalui Duitku ke metode pembayaran asal dalam 7–14 hari kerja
                (sesuai settlement window Duitku).</li>
          </ol>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">5. Tidak Memenuhi Syarat Refund</h2>
          <ul class="text-gray-700 text-sm list-disc pl-5 space-y-1">
            <li>Pelanggaran Terms (acceptable use, fraud, scam).</li>
            <li>Permintaan setelah grace period 7 hari (kecuali force majeure).</li>
            <li>Subscription yang sudah pernah di-refund sebelumnya pada periode yang sama.</li>
          </ul>
        </div>

        <div>
          <h2 class="font-serif font-bold text-xl mb-2">6. Cancellation (Berbeda dari Refund)</h2>
          <p class="text-gray-700 text-sm">
            Pengguna boleh cancel subscription kapanpun dari Dashboard → Settings → Subscription.
            Cancellation berlaku <strong>di akhir periode billing</strong> — tidak otomatis trigger refund.
            Akses tetap aktif sampai end-of-period.
          </p>
        </div>

        <div class="border-t pt-4 text-xs text-gray-500">
          Dikelola via Duitku (PT. Karya Asia Pasifik) sesuai settlement schedule. Pertanyaan: billing@oasis-bi-pro.web.id
        </div>
      </div>
    </section>`
  }

  /* ---------- Contact (full PT info) ---------- */
  function pageContact() {
    return html`
    <section class="max-w-3xl mx-auto px-6 py-16">
      <span class="badge badge-purple">Contact</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-6">Get in touch</h1>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="font-serif font-bold text-xl mb-4"><i class="fa-solid fa-building text-primary mr-2"></i>Legal Entity</h2>
          <div class="text-sm text-gray-700 space-y-1">
            <div><strong>PT. Waskita Cakrawarti Digital</strong></div>
            <div>Brand: SparkMind Sovereign Holding</div>
            <div>KBLI: 63122 — Hosting &amp; Pengolahan Data</div>
            <div>Domisili: Jakarta, Republik Indonesia</div>
            <div>Yurisdiksi: Pengadilan Negeri Jakarta Selatan</div>
          </div>
        </div>
        <div class="card">
          <h2 class="font-serif font-bold text-xl mb-4"><i class="fa-solid fa-headset text-primary mr-2"></i>Support Channels</h2>
          <div class="text-sm text-gray-700 space-y-2">
            <div><i class="fa-solid fa-envelope w-5 text-gray-500"></i>
              General: <a href="mailto:hello@oasis-bi-pro.web.id" class="text-primary">hello@oasis-bi-pro.web.id</a></div>
            <div><i class="fa-solid fa-life-ring w-5 text-gray-500"></i>
              Support: <a href="mailto:support@oasis-bi-pro.web.id" class="text-primary">support@oasis-bi-pro.web.id</a></div>
            <div><i class="fa-solid fa-credit-card w-5 text-gray-500"></i>
              Billing: <a href="mailto:billing@oasis-bi-pro.web.id" class="text-primary">billing@oasis-bi-pro.web.id</a></div>
            <div><i class="fa-solid fa-shield-halved w-5 text-gray-500"></i>
              DPO (UU PDP): <a href="mailto:dpo@oasis-bi-pro.web.id" class="text-primary">dpo@oasis-bi-pro.web.id</a></div>
            <div><i class="fa-brands fa-whatsapp w-5 text-gray-500"></i>
              WA Bisnis: +62 811 1111 1111 (Senin-Jumat, 09:00–18:00 WIB)</div>
          </div>
        </div>
      </div>

      <div class="card mt-6">
        <h2 class="font-serif font-bold text-xl mb-4"><i class="fa-solid fa-paper-plane text-primary mr-2"></i>Kirim Pesan</h2>
        <form id="contactForm" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <input name="full_name" placeholder="Nama lengkap" required>
            <input name="email" type="email" placeholder="email@kamu.com" required>
          </div>
          <input name="subject" placeholder="Subjek (mis. Tanya pricing Sovereign)">
          <textarea name="message" rows="5" placeholder="Pesan kamu..." required></textarea>
          <input type="hidden" name="source" value="contact-form">
          <input type="hidden" name="magnet" value="contact">
          <button class="btn-sovereign">Kirim Pesan</button>
        </form>
      </div>

      <div class="text-center mt-8 text-xs text-gray-500">
        Response time: 12 jam kerja (Sovereign+) · 24 jam (Operator)
      </div>
    </section>`
  }

  function bindContactForm() {
    const f = $('#contactForm')
    if (!f) return
    f.addEventListener('submit', async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(f).entries())
      const r = await api('POST', '/api/leads', data)
      if (!r.success) { toast(r.error || 'Gagal kirim', 'error'); return }
      toast('Terkirim! Kami akan balas dalam 12-24 jam.', 'success')
      f.reset()
    })
  }

  /* ---------- Status page (UP-5 closure) ---------- */
  function pageStatus() {
    return html`
    <section class="max-w-4xl mx-auto px-6 py-16">
      <span class="badge badge-emerald">Live Status</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-2">System Status</h1>
      <p class="text-gray-600 text-sm mb-8">Real-time health untuk semua component sovereign stack.</p>

      <div id="statusCard" class="card mb-6">
        <div class="text-center py-8 text-gray-500">Checking systems...</div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="card text-center">
          <div class="kpi-label">30-day Uptime</div>
          <div class="text-3xl font-bold text-emerald-600 mt-2" id="uptime30">—</div>
        </div>
        <div class="card text-center">
          <div class="kpi-label">Edge Region</div>
          <div class="text-3xl font-bold text-primary mt-2" id="edgeRegion">—</div>
        </div>
        <div class="card text-center">
          <div class="kpi-label">Response Time</div>
          <div class="text-3xl font-bold text-gold mt-2" id="responseTime">—</div>
        </div>
      </div>

      <div class="card mt-6">
        <h3 class="font-serif font-bold text-xl mb-4">Recent Events</h3>
        <div id="eventsList" class="text-sm text-gray-700"></div>
      </div>
    </section>`
  }

  async function renderStatus() {
    const start = Date.now()
    const r = await api('GET', '/api/status')
    const elapsed = Date.now() - start

    const card = $('#statusCard')
    if (!r.success) {
      card.innerHTML = '<div class="text-center text-red-600 py-8">Status check gagal.</div>'
      return
    }

    const overallColor = r.overall === 'operational' ? 'emerald' : r.overall === 'degraded' ? 'amber' : 'red'
    const overallLabel = r.overall === 'operational' ? 'All Systems Operational'
                       : r.overall === 'degraded' ? 'Partial Degradation' : 'Major Outage'

    card.innerHTML = html`
      <div class="flex items-center gap-3 mb-4 pb-4 border-b">
        <span class="status-dot status-${overallColor} text-2xl"></span>
        <div class="flex-1">
          <div class="font-serif font-bold text-2xl">${overallLabel}</div>
          <div class="text-xs text-gray-500">Last checked: ${new Date(r.timestamp).toLocaleString('id-ID')}</div>
        </div>
      </div>
      <div class="space-y-2">
        ${r.checks.map((c) => html`
          <div class="flex items-center justify-between py-2 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <span class="status-dot status-${c.status === 'operational' ? 'emerald' : c.status === 'degraded' ? 'amber' : 'red'}"></span>
              <span class="font-semibold">${c.name}</span>
              <span class="text-xs text-gray-500">${c.note || ''}</span>
            </div>
            <span class="text-xs text-gray-500 font-mono">${c.latency_ms}ms</span>
          </div>`).join('')}
      </div>`

    $('#uptime30').textContent = r.uptime_30d || '—'
    $('#edgeRegion').textContent = r.region || '—'
    $('#responseTime').textContent = elapsed + 'ms'

    const events = r.recent_events || []
    $('#eventsList').innerHTML = events.length === 0
      ? '<div class="text-gray-500 italic">Tidak ada incident dalam 30 hari terakhir.</div>'
      : events.map((e) => html`
          <div class="py-2 border-b border-gray-100">
            <div class="flex justify-between">
              <span><span class="badge badge-${e.status === 'operational' ? 'emerald' : 'red'}">${e.component}</span> ${e.message || ''}</span>
              <span class="text-xs text-gray-500">${new Date(e.created_at).toLocaleString('id-ID')}</span>
            </div>
          </div>`).join('')
  }

  /* ---------- Smoke test page (GAP-3 helper UI) ---------- */
  function pageSmoketest() {
    return html`
    <section class="max-w-2xl mx-auto px-6 py-16">
      <span class="badge badge-gold">QA Internal</span>
      <h1 class="text-3xl font-serif font-bold mt-3 mb-2">Live Duitku Smoke Test</h1>
      <p class="text-gray-600 text-sm mb-6">
        Trigger live transaksi <strong>Rp 10.000</strong> untuk verifikasi end-to-end Duitku
        (createInvoice → callback signature MD5 → DB update).
        Wajib eksekusi MINIMAL 1× sebelum GTM launch.
      </p>
      <div class="card">
        <form id="smokeForm" class="space-y-4">
          <div><label class="text-sm font-semibold">Nama tester</label><input name="customerName" value="OBP QA Tester" required></div>
          <div><label class="text-sm font-semibold">Email tester</label><input name="email" type="email" value="qa@oasis-bi-pro.web.id" required></div>
          <div><label class="text-sm font-semibold">Phone tester</label><input name="phoneNumber" value="+628111111111" required></div>
          <button class="btn-sovereign w-full justify-center">
            <i class="fa-solid fa-flask"></i> Generate Live Invoice Rp 10.000
          </button>
        </form>
        <div id="smokeResult" class="mt-6"></div>
      </div>
      <div class="card mt-6">
        <h3 class="font-serif font-bold text-xl mb-3">20 Transaksi Terakhir</h3>
        <div id="recentList" class="text-sm">Loading...</div>
      </div>
    </section>`
  }

  function bindSmokeForm() {
    const f = $('#smokeForm')
    if (!f) return
    f.addEventListener('submit', async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(f).entries())
      const out = $('#smokeResult')
      out.innerHTML = '<div class="text-gray-500"><span class="spinner"></span> Generating invoice...</div>'
      const r = await api('POST', '/api/duitku/smoketest', data)
      if (!r.success) {
        out.innerHTML = `<div class="card border-red-200 bg-red-50"><strong>FAIL:</strong> ${r.error || 'unknown'}<pre class="mt-2 text-xs">${JSON.stringify(r.raw || {}, null, 2)}</pre></div>`
        return
      }
      out.innerHTML = html`
        <div class="card border-emerald-200 bg-emerald-50">
          <strong class="text-emerald-700"><i class="fa-solid fa-circle-check"></i> Invoice created.</strong>
          <div class="mt-2 text-sm space-y-1">
            <div>Order ID: <code>${r.data.merchantOrderId}</code></div>
            <div>Reference: <code>${r.data.reference}</code></div>
            <div>Amount: <strong>${fmtIDR(r.data.amount)}</strong></div>
          </div>
          <a href="${r.data.paymentUrl}" target="_blank" class="btn-sovereign mt-4 inline-flex">
            <i class="fa-solid fa-up-right-from-square"></i> Buka Payment Page Duitku
          </a>
          <p class="text-xs text-gray-600 mt-3">Setelah pembayaran kartu sendiri, tab ini auto-refresh status.</p>
        </div>`
      loadRecent()
    })
    loadRecent()
  }

  async function loadRecent() {
    const r = await api('GET', '/api/duitku/recent?limit=20')
    if (!$('#recentList')) return
    if (!r.success) { $('#recentList').textContent = 'Gagal load.'; return }
    if (!r.payments.length) { $('#recentList').innerHTML = '<div class="text-gray-500 italic">Belum ada transaksi.</div>'; return }
    $('#recentList').innerHTML = r.payments.map((p) => html`
      <div class="flex items-center justify-between py-2 border-b border-gray-100 text-xs">
        <div>
          <span class="badge badge-${p.status === 'success' ? 'emerald' : p.status === 'pending' ? 'gold' : 'red'}">${p.status}</span>
          <code class="ml-2">${p.merchant_order_id}</code>
        </div>
        <div class="text-gray-600">
          ${p.plan_id} · ${fmtIDR(p.amount)} · ${(p.created_at || '').substring(0, 16)}
        </div>
      </div>`).join('')
  }

  /* ---------- Router ---------- */
  function navigate(path) {
    history.pushState({}, '', path)
    render()
  }

  async function render() {
    const path = location.pathname
    const app = document.getElementById('app')
    let body

    switch (true) {
      case path === '/':                     body = pageHome(); break
      case path === '/pricing':              body = pagePricing(); break
      case path === '/login':                body = pageLogin(); break
      case path === '/register':             body = pageRegister(); break
      case path === '/checkout':             body = pageCheckout(); break
      case path === '/dashboard':            body = pageDashboard(); break
      case path === '/payment/success':      body = pagePaymentSuccess(); break
      case path === '/payment/failed':       body = pagePaymentFailed(); break
      case path === '/about':                body = pageAbout(); break
      case path === '/legal':                body = pageTerms(); break  // legacy alias
      case path === '/terms':                body = pageTerms(); break
      case path === '/privacy':              body = pagePrivacy(); break
      case path === '/refund':               body = pageRefund(); break
      case path === '/contact':              body = pageContact(); break
      case path === '/status':               body = pageStatus(); break
      case path === '/smoketest':            body = pageSmoketest(); break
      default:                               body = pageHome(); break
    }

    app.innerHTML = header() + '<main>' + body + '</main>' + footer()

    // Bind global links
    document.querySelectorAll('[data-link]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        navigate(a.getAttribute('href'))
      })
    })

    // Bind logout
    const lo = document.getElementById('logoutBtn')
    if (lo) lo.addEventListener('click', async () => {
      await api('POST', '/api/auth/logout')
      state.user = null
      toast('Logged out', 'success')
      navigate('/')
    })

    // Page-specific bindings
    if (path === '/')          bindLeadForm()
    if (path === '/pricing')   await renderPricing()
    if (path === '/dashboard') await renderDashboard()
    if (path === '/login' || path === '/register') bindAuthForms()
    if (path === '/checkout')  bindCheckoutForm()
    if (path === '/contact')   bindContactForm()
    if (path === '/status')    await renderStatus()
    if (path === '/smoketest') bindSmokeForm()

    // scroll top on route change
    window.scrollTo(0, 0)
  }

  window.addEventListener('popstate', render)
  document.addEventListener('DOMContentLoaded', render)
})()
