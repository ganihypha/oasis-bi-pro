/* OASIS BI Pro — frontend SPA (vanilla JS, no framework) */
(() => {
  const initial = window.__INITIAL__ || {}
  const state = {
    user: initial.user || null,
    appName: initial.appName || 'OASIS BI Pro',
    version: initial.version || '3.0.0-cloudflare',
    plans: null
  }

  /* ---------- Helpers ---------- */
  const fmtIDR = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID')
  const $ = (sel) => document.querySelector(sel)
  const html = (strings, ...values) => strings.map((s, i) => s + (values[i] != null ? values[i] : '')).join('')

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
      <div class="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm text-gray-600">
        <div>
          <div class="brand-mark text-xl font-serif font-bold mb-2">OASIS BI Pro</div>
          <div class="text-xs">A SparkMind sovereign product</div>
          <div class="text-xs mt-2">Sovereign Business Intelligence for solopreneur & micro-agency Indonesia.</div>
        </div>
        <div>
          <div class="font-semibold text-ink mb-3">Product</div>
          <a data-link href="/pricing" class="block hover:text-primary">Pricing</a>
          <a data-link href="/dashboard" class="block hover:text-primary">Dashboard</a>
          <a data-link href="/about" class="block hover:text-primary">About</a>
        </div>
        <div>
          <div class="font-semibold text-ink mb-3">Stack</div>
          <div class="text-xs">Cloudflare Pages</div>
          <div class="text-xs">Cloudflare Workers</div>
          <div class="text-xs">D1 · KV · R2</div>
          <div class="text-xs">Hono framework</div>
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
        © ${new Date().getFullYear()} SparkMind Sovereign Holding · v${state.version}
      </div>
    </footer>`
  }

  /* ---------- Pages ---------- */
  function pageHome() {
    return html`
    <section class="hero-gradient text-white">
      <div class="max-w-6xl mx-auto px-6 py-24 text-center">
        <span class="badge badge-gold mb-6 inline-block">v${state.version} · Cloudflare Sovereign Stack</span>
        <h1 class="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
          Business Intelligence<br>
          <span class="text-goldSoft">untuk Sovereign Operator.</span>
        </h1>
        <p class="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto mb-10">
          Dashboard interaktif, AI-powered insight, dan automated reporting — dibangun di edge Cloudflare,
          tanpa Vercel, tanpa Supabase, sovereign 100%.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a data-link href="/register" class="btn-sovereign btn-gold text-base">
            <i class="fa-solid fa-rocket"></i> Mulai Gratis 14 Hari
          </a>
          <a data-link href="/pricing" class="btn-outline text-white border-white">View Pricing</a>
        </div>
        <div class="mt-12 grid md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
          ${[
            ['fa-bolt','Edge-first','Sub-50ms global latency'],
            ['fa-shield-halved','Sovereign','UU PDP 27/2022 compliant'],
            ['fa-credit-card','Duitku Ready','Subscription billing'],
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
    </section>`
  }

  function pagePricing() {
    return html`
    <section class="max-w-6xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <span class="badge badge-purple mb-4 inline-block">Pricing</span>
        <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4">
          Pilih plan untuk sovereignty operator-mu.
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Semua paket include trial 14 hari. Pembayaran via Duitku — VA, e-wallet, QRIS, kartu kredit.
        </p>
      </div>
      <div id="pricingGrid" class="grid md:grid-cols-3 gap-6">
        <div class="text-center text-gray-500 col-span-3">Loading plans...</div>
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
      <div class="card ${p.popular ? 'card-popular' : ''}">
        <div class="text-sm uppercase tracking-widest text-gray-500">${p.id}</div>
        <h3 class="font-serif font-bold text-3xl mt-1 mb-1">${p.name}</h3>
        <div class="text-4xl font-bold text-primary mt-4">${fmtIDR(p.price)}</div>
        <div class="text-sm text-gray-500">/ ${p.duration === 'monthly' ? 'bulan' : p.duration}</div>
        <ul class="mt-6 space-y-2 text-sm text-gray-700">
          ${p.features.map((f) => html`<li><i class="fa-solid fa-check text-primary mr-2"></i>${f}</li>`).join('')}
        </ul>
        <button class="btn-sovereign w-full mt-6" data-plan="${p.id}" data-action="checkout">
          Pilih ${p.name}
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
      toast('Akun berhasil dibuat. Welcome!', 'success')
      navigate('/dashboard')
    })
  }

  function pageDashboard() {
    const u = state.user
    return html`
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
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

      <div class="grid md:grid-cols-4 gap-4 mb-8" id="kpiGrid">
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
        <div class="kpi-card"><div class="kpi-label">Loading...</div></div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6 mb-8">
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

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-serif font-bold text-xl">Team Members</h3>
          <span class="badge badge-purple" id="teamCount">…</span>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody id="teamBody"><tr><td colspan="4" class="text-center text-gray-500">Loading...</td></tr></tbody>
        </table>
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
  }

  function pagePaymentSuccess() {
    return html`
    <section class="max-w-xl mx-auto px-6 py-20 text-center">
      <div class="card">
        <i class="fa-solid fa-circle-check text-emerald-600 text-6xl mb-4"></i>
        <h1 class="text-3xl font-serif font-bold mb-2">Pembayaran Berhasil</h1>
        <p class="text-gray-600 mb-6">Subscription kamu sudah aktif. Trims sudah jadi sovereign operator.</p>
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
        <a data-link href="/pricing" class="btn-sovereign">Coba Lagi</a>
      </div>
    </section>`
  }

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
        <li><strong>SparkMind</strong> — sovereign parent (sparkmind.web.id)</li>
        <li><strong>OASIS BI Pro</strong> — BI SaaS sub-brand (live)</li>
        <li><strong>Spiritual OS</strong> — blueprint sub-brand</li>
        <li><strong>Sovereign Forge</strong> — pre-named placeholder</li>
      </ul>
      <h2 class="text-2xl font-serif font-bold mt-8 mb-3">Compliance</h2>
      <ul class="text-gray-700 space-y-1">
        <li>UU PDP 27/2022 · Privacy hard-rule cross-brand</li>
        <li>KBLI 63122 · Data hosting & processing</li>
        <li>Pure-BI · Non-PayFac · Subscription-only Duitku usage</li>
      </ul>
    </section>`
  }

  function pageLegal() {
    return html`
    <section class="max-w-3xl mx-auto px-6 py-16">
      <span class="badge badge-purple">Legal</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-6">Terms & Privacy</h1>
      <div class="card">
        <h2 class="font-serif font-bold text-xl mb-2">Privacy (UU PDP 27/2022)</h2>
        <p class="text-gray-700 text-sm">Data pengguna disimpan di Cloudflare D1 (region multi-edge). Cross-brand sharing dilarang tanpa consent eksplisit.</p>
      </div>
      <div class="card mt-4">
        <h2 class="font-serif font-bold text-xl mb-2">Terms of Service</h2>
        <p class="text-gray-700 text-sm">Subscription billing via Duitku. Refund window 7 hari kalender. Trial 14 hari.</p>
      </div>
    </section>`
  }

  function pageContact() {
    return html`
    <section class="max-w-2xl mx-auto px-6 py-16">
      <span class="badge badge-purple">Contact</span>
      <h1 class="text-4xl font-serif font-bold mt-3 mb-6">Get in touch</h1>
      <div class="card">
        <p>Email: <a href="mailto:support@oasis-bi-pro.web.id" class="text-primary">support@oasis-bi-pro.web.id</a></p>
        <p class="mt-2">Brand parent: <strong>SparkMind Sovereign Holding</strong></p>
      </div>
    </section>`
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
      case path === '/legal':                body = pageLegal(); break
      case path === '/contact':              body = pageContact(); break
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
    if (path === '/pricing')   await renderPricing()
    if (path === '/dashboard') await renderDashboard()
    if (path === '/login' || path === '/register') bindAuthForms()
    if (path === '/checkout')  bindCheckoutForm()
  }

  window.addEventListener('popstate', render)
  document.addEventListener('DOMContentLoaded', render)
})()
