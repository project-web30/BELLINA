/* ====== PENGATURAN: ganti nomor WhatsApp (format 62, tanpa + atau 0 di depan) ====== */
const NO = '62882009911783';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rp = n => 'Rp ' + n.toLocaleString('id-ID');
const wa = t => `https://wa.me/${NO}?text=${encodeURIComponent(t)}`;

// Shade: baris = tingkat kecerahan (Terang, Sedang, Tan, Gelap), kolom = undertone (Cool, Neutral, Warm)
const TONE = ['Terang', 'Sedang', 'Tan', 'Gelap'], UND = ['Cool / Pink', 'Neutral', 'Warm / Kuning'];
const SH = [
  [['02 Light Ivory', '#EBCBB0'], ['01 Porcelain Pink', '#F4D6CC'], ['03 Light Beige', '#E9C6A2']],
  [['04 Rose Beige', '#DDB09B'], ['05 Natural Sand', '#D9AE8A'], ['06 Golden Beige', '#D4A478']],
  [['07 Warm Rose', '#C48E78'], ['08 Honey Tan', '#C0895F'], ['09 Golden Tan', '#B97F4E']],
  [['10 Deep Rose', '#9E6552'], ['11 Rich Mocha', '#8F5A3A'], ['12 Deep Caramel', '#85502F']]
];
const DESC = ['Sangat pas untuk kulit cerah dengan nuansa seimbang tanpa efek abu-abu. Tampilan satin glowing alami sepanjang hari.','Cocok untuk kulit sawo muda dengan hasil menyatu halus dan tampilan segar yang natural.','Pas untuk kulit tan dengan nuansa hangat yang merata dan glowing sehat sepanjang hari.','Dirancang untuk kulit gelap dengan hasil kaya warna, bebas efek abu-abu, dan tampilan satin alami.'];
const PR = { foundation: ['Liquid Foundation', 89000], cushion: ['Cushion Bellina', 95000], concealer: ['Bellina Concealer', 65000] };

const qs = new URLSearchParams(location.search);
const st = {
  p: PR[qs.get('produk')] ? qs.get('produk') : 'cushion',
  t: Math.min(3, Math.max(0, +qs.get('t') || 0)),
  u: Math.min(2, Math.max(0, +qs.get('u') || 0)),
  n: 1
};

// Navbar: bayangan saat scroll + menu mobile
const nav = $('.nav');
addEventListener('scroll', () => nav.classList.toggle('sc', scrollY > 10), { passive: true });
$('#burger').addEventListener('click', e => {
  const open = $('#menu').classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => $('#menu').classList.remove('open')));

// Muncul saat di-scroll
const io = new IntersectionObserver(es => es.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
}), { threshold: .12 });
$$('.rv').forEach(e => io.observe(e));

// Tautan WhatsApp umum
$$('[data-wa]').forEach(a => {
  a.href = wa(a.dataset.wa || 'Halo Bellina, saya ingin bertanya tentang produk Bellina Cosmetik.');
  a.target = '_blank'; a.rel = 'noopener';
});

// Tampilan: shade finder, pilihan produk, ringkasan pesanan
const set = (s, v) => { const e = $(s); if (e) e.textContent = v; };
function render() {
  const [shade, col] = SH[st.t][st.u], [pn, hg] = PR[st.p], total = hg * st.n;
  $$('[data-t]').forEach(b => b.classList.toggle('on', +b.dataset.t === st.t));
  $$('[data-u]').forEach(b => b.classList.toggle('on', +b.dataset.u === st.u));
  $$('[data-p]').forEach(b => {
    const on = b.dataset.p === st.p;
    b.classList.toggle('on', on);
    const tg = $('.tag', b); if (tg) tg.textContent = on ? 'Terpilih' : 'Pilih produk';
  });
  const sn = $('#shName'); if (sn) sn.textContent = (sn.dataset.pre || '') + shade;
  set('#shDesc', DESC[st.t]);
  const dot = $('#shDot'); if (dot) dot.style.background = col;
  const go = $('#goShade'); if (go) go.href = `pesan.html?produk=cushion&t=${st.t}&u=${st.u}`;
  if ($('#sumName')) {
    set('#sumName', pn); set('#sumShade', `${shade} · ${st.n} produk`);
    set('#sumSub', rp(total)); set('#sumTot', rp(total)); set('#qty', st.n);
    $('#sumDot').style.background = col; set('#sumPrice', rp(hg));
    $('#sumImg').style.setProperty('--img', `url(../assets/${st.p}.jpg)`);
    $('#waBtn').href = wa(`Halo Bellina, saya ingin memesan:\n- Produk: ${pn}\n- Shade: ${shade} (${TONE[st.t]}, ${UND[st.u]})\n- Jumlah: ${st.n}\n- Total sementara: ${rp(total)}\n\nMohon konfirmasi ketersediaan dan ongkos kirim. Terima kasih.`);
  }
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-t],[data-u],[data-p],[data-q]');
  if (!b) return;
  if (b.dataset.t) st.t = +b.dataset.t;
  if (b.dataset.u) st.u = +b.dataset.u;
  if (b.dataset.p) st.p = b.dataset.p;
  if (b.dataset.q) st.n = Math.min(99, Math.max(1, st.n + +b.dataset.q));
  render();
});
const wb = $('#waBtn'); if (wb) { wb.target = '_blank'; wb.rel = 'noopener'; }
render();
