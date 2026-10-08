const fill = document.getElementById('depthFill');
const label = document.getElementById('depthLabel');
const bgA = document.getElementById('bgLayerA');
const bgB = document.getElementById('bgLayerB');
const menuThemeToggle = document.getElementById('menuThemeToggle');
const formNome = document.getElementById('nome');
const formEmail = document.getElementById('email');
const formTelefone = document.getElementById('telefone');
const formMensagem = document.getElementById('mensagem');
const utm = window.TorrinhaUTM;
let trackingConsent = false;
const ADS_CONVERSION_LABEL = ''; // preencher com o rótulo da ação de conversão
const isPixel = (v) => /^\d{15,16}$/.test(v || '');
const initTracking = () => {
trackingConsent = true;
const trackingIds = window.TRACKING_IDS || {};
if (isPixel(trackingIds.metaPixel)) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', trackingIds.metaPixel);
  window.fbq('track', 'PageView');
}
};

const cookieBanner = document.getElementById('cookieBanner');
const consentKey = 'torrinha_cookie_consent';
try {
  const consent = localStorage.getItem(consentKey);
  if (consent === 'accepted') initTracking();
  else if (!consent && cookieBanner) cookieBanner.hidden = false;
} catch { if (cookieBanner) cookieBanner.hidden = false; }
const saveConsent = (value) => { try { localStorage.setItem(consentKey, value); } catch {} cookieBanner?.setAttribute('hidden', ''); cookieBanner?.setAttribute('aria-hidden', 'true'); if (value === 'accepted') { window.torrinhaConsentGranted?.(); initTracking(); } };
document.getElementById('acceptCookies')?.addEventListener('click', () => saveConsent('accepted'));
document.getElementById('rejectCookies')?.addEventListener('click', () => saveConsent('rejected'));

const currentUtm = {};
try { const params = new URLSearchParams(window.location.search); const values = utm.read(window.location.search, document.referrer); const consent = localStorage.getItem('torrinha_cookie_consent') === 'accepted'; utm.keys.forEach(k => { if (values[k]) currentUtm[k] = values[k]; }); if (consent) utm.keys.forEach(k => { if (!currentUtm[k]) { try { currentUtm[k] = sessionStorage.getItem(k) || ''; } catch {} } if (currentUtm[k]) { try { sessionStorage.setItem(k, currentUtm[k]); } catch {} } }); } catch {}
const getOrigem = () => utm.origem(currentUtm);
const trackingData = () => Object.fromEntries(Object.entries(currentUtm).filter(([, v]) => v));
const prepareWhatsApp = (button) => { if (!button.dataset.waBase) button.dataset.waBase = button.getAttribute('href') || ''; const url = new URL(button.dataset.waBase, window.location.href); const text = url.searchParams.get('text') || ''; const origem = getOrigem(); url.searchParams.set('text', origem ? `${text} (Origem: ${origem})` : text); button.href = url.toString(); button.dataset.utmOrigem = origem; if (new URLSearchParams(window.location.search).get('utm_debug') === '1') console.debug('[UTM]', { captured: currentUtm, origem, href: button.href }); };
const sendConversion = () => { if (ADS_CONVERSION_LABEL && typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: 'AW-18500249861/' + ADS_CONVERSION_LABEL }); };
const trackWhatsAppClick = (button) => { prepareWhatsApp(button); const data = { ...trackingData(), local_botao: button.dataset.origem || 'outro', roteiro: button.dataset.roteiro || button.closest('[data-route]')?.dataset.route || '' }; if (!trackingConsent) return; window.gtag('event', 'clique_whatsapp', { ...data, transport_type: 'beacon' }); sendConversion(); };
document.addEventListener('click', (event) => { const link = event.target.closest('a[href]'); if (!link) return; const href = link.href.toLowerCase(); if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackWhatsAppClick(link); if (href.startsWith('tel:') && trackingConsent) { window.gtag('event', 'clique_telefone', { local_botao: link.dataset.origem || 'outro' }); sendConversion(); } });
['mousedown', 'touchstart', 'focusin'].forEach(type => document.addEventListener(type, event => { const button = event.target.closest('a[href^="https://wa.me"], a[href^="https://api.whatsapp.com"]'); if (button) prepareWhatsApp(button); }, type === 'touchstart' ? { passive: true } : undefined));
document.querySelectorAll('.btn-whatsapp').forEach(prepareWhatsApp);
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxLeftKicker = document.getElementById('lightboxLeftKicker');
const lightboxLeftTitle = document.getElementById('lightboxLeftTitle');
const lightboxLeftText = document.getElementById('lightboxLeftText');
const lightboxRightKicker = document.getElementById('lightboxRightKicker');
const lightboxRightTitle = document.getElementById('lightboxRightTitle');
const lightboxRightText = document.getElementById('lightboxRightText');
const routeModal = document.getElementById('routeModal');
const routeModalKicker = document.getElementById('routeModalKicker');
const routeModalTitle = document.getElementById('routeModalTitle');
const routeModalSummary = document.getElementById('routeModalSummary');
const routeModalGrid = document.getElementById('routeModalGrid');
const routeModalNotes = document.getElementById('routeModalNotes');
const maxMeters = 14500;
const reveals = document.querySelectorAll('.reveal');
const cards = document.querySelectorAll('.card, .shot, .info-item, details, .hero-panel');
const galleryShots = Array.from(document.querySelectorAll('.shot'));
const aiChat = document.getElementById('aiChat');
const aiChatOpen = document.getElementById('aiChatOpen');
const aiChatClose = document.getElementById('aiChatClose');
const aiChatForm = document.getElementById('aiChatForm');
const aiChatInput = document.getElementById('aiChatInput');
const aiChatMessages = document.getElementById('aiChatMessages');
const aiChatHistory = [];

const addAiMessage = (message, type) => {
  const item = document.createElement('div');
  item.className = `ai-chat__message ai-chat__message--${type}`;
  item.textContent = message;
  aiChatMessages.appendChild(item);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  return item;
};

const addAiLoading = () => {
  const item = document.createElement('div');
  item.className = 'ai-chat__message ai-chat__message--bot ai-chat__loading';
  item.innerHTML = '<span></span><span></span><span></span>';
  aiChatMessages.appendChild(item);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  return item;
};

const scrollToRelevantSection = (question) => {
  const normalized = question.toLowerCase();
  const section = normalized.match(/roteiro|passeio|trilha|formação|estalactite|estalagmite/) ? 'rotas'
    : normalized.match(/horário|hora|preço|valor|reserva|segurança|criança|acessibilidade/) ? 'visita'
      : normalized.match(/onde|endereço|localização|mapa|distância|km/) ? 'localizacao'
        : normalized.match(/instagram|whatsapp|telefone|contato|falar/) ? 'contato'
          : null;
  if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

aiChatOpen?.addEventListener('click', () => {
  aiChat.classList.add('is-open');
  aiChat.setAttribute('aria-hidden', 'false');
  aiChatInput.focus();
});
aiChatClose?.addEventListener('click', () => {
  aiChat.classList.remove('is-open');
  aiChat.setAttribute('aria-hidden', 'true');
});
aiChatForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = aiChatInput.value.trim();
  if (!question) return;
  addAiMessage(question, 'user');
  aiChatHistory.push({ role: 'user', content: question });
  scrollToRelevantSection(question);
  aiChatInput.value = '';
  aiChatInput.disabled = true;
  aiChatForm.querySelector('button').disabled = true;
  const loading = addAiLoading();
  try {
    const response = await fetch('https://sitetorrinha.vercel.app/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: aiChatHistory.slice(-8) })
    });
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error('O atendimento está sendo atualizado. Tente novamente em alguns segundos.');
    }
    loading.remove();
    if (!response.ok) throw new Error(data.error || 'Não foi possível responder agora.');
    addAiMessage(data.answer, 'bot');
    aiChatHistory.push({ role: 'assistant', content: data.answer });
  } catch (error) {
    loading.remove();
    addAiMessage(error.message || 'Não foi possível responder agora.', 'error');
  } finally {
    aiChatInput.disabled = false;
    aiChatForm.querySelector('button').disabled = false;
    aiChatInput.focus();
  }
});
const siteHeader = document.querySelector('header');
let lastScrollY = window.scrollY;
let scrollTicking = false;

const updateHeaderVisibility = () => {
  const currentScrollY = window.scrollY;
  if (!window.matchMedia('(max-width: 899px)').matches) {
    siteHeader?.classList.remove('header-hidden');
    lastScrollY = currentScrollY;
    scrollTicking = false;
    return;
  }
  if (currentScrollY <= 12) {
    siteHeader?.classList.remove('header-hidden');
  } else if (currentScrollY > lastScrollY + 4) {
    siteHeader?.classList.add('header-hidden');
  } else if (currentScrollY < lastScrollY - 4) {
    siteHeader?.classList.remove('header-hidden');
  }
  lastScrollY = currentScrollY;
  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeaderVisibility);
    scrollTicking = true;
  }
}, { passive: true });
const routeCards = Array.from(document.querySelectorAll('.route[data-route]'));
const bgImages = [
  'assets/3flor.jpg',
  'assets/agulha-1.jpg',
  'assets/bolha.jpg',
  'assets/cavidade.jpg',
  'assets/cristal.png',
  'assets/drinki.jpg',
  'assets/flor.png',
  'assets/salao-branco.jpg',
  'assets/vulcao.jpg'
];
let activeBgIndex = -1;
let showingA = true;
let backgroundIndex = 0;
let activeLightboxIndex = 0;
let routeModalTrigger = null;
let lightboxTrigger = null;
const routeDetails = {
  capitao: {
    kicker: 'Roteiro do Capitão',
    title: 'O percurso mais histórico',
    summary: 'Esse é o roteiro ideal para quem quer sentir a origem da exploração da Torrinha, com caminhada mais curta e leitura clara das formações clássicas.',
    stats: [['Acesso a pé', 'Cerca de 700 m'], ['Duração', 'Aproximadamente 1h'], ['Esforço', 'Leve'], ['Perfil', 'Primeira visita'], ['Valor por pessoa', 'R$ 40,00']],
    notes: 'Pontos fortes: estalactites, estalagmites, colunas e cortinas. Ótimo para uma visita introdutória sem perder a atmosfera da caverna.'
  },
  valery: {
    kicker: 'Roteiro Valery',
    title: 'O percurso mais fotogênico',
    summary: 'Voltado para formações raras e enquadramentos mais impressionantes, com destaque para detalhes delicados e cristais curiosos.',
    stats: [['Acesso a pé', 'Cerca de 1,2 km'], ['Duração', 'Aproximadamente 1h30'], ['Esforço', 'Moderado'], ['Perfil', 'Melhor para fotos'], ['Valor por pessoa', 'R$ 70,00']],
    notes: 'Pontos fortes: flores de aragonita, helictites e agulhas de gipsita. Boa escolha para quem quer ver mais variedade geológica.'
  },
  raridades: {
    kicker: 'Roteiro das Raridades',
    title: 'O percurso mais detalhado',
    summary: 'Esse roteiro junta algumas das formações mais incomuns da Torrinha em um trajeto pensado para quem quer observar tudo com calma.',
    stats: [['Duração', 'Aproximadamente 1h40'], ['Esforço', 'Moderado'], ['Valor por pessoa', 'R$ 80,00'], ['Destaque', 'Bolha de calcita com flor']],
    notes: 'Inclui o Salão dos Vulcões, helictite com flor na ponta e a réplica do Morro do Pai Inácio. É o roteiro para quem curte detalhes e curiosidades.'
  },
  completo: {
    kicker: 'Roteiro Completo',
    title: 'A experiência mais ampla',
    summary: 'Une os trechos principais e entrega a leitura mais completa da caverna, com um panorama mais rico da Torrinha como um todo.',
    stats: [['Acesso', 'Cerca de 3,0 km'], ['Duração', 'Até 2h30'], ['Esforço', 'Moderado a avançado'], ['Perfil', 'Imersão total'], ['Valor por pessoa', 'R$ 150,00']],
    notes: 'É a melhor opção para quem quer sair com a noção mais completa da geologia, do percurso e das principais formações do local.'
  }
};
const galleryInfo = [
  { kicker: 'Formações', title: 'Salão principal', text: 'Uma vista ampla da caverna, com destaque para os salões e o relevo das formações.' },
  { kicker: 'Raridade', title: 'Flores de aragonita', text: 'Detalhe de uma das formações mais raras da Torrinha, com textura delicada e visual marcante.' },
  { kicker: 'Profundidade', title: 'Interior iluminado', text: 'Cena do interior com contraste de luz, rocha e colunas naturais.' },
  { kicker: 'Aragonita', title: 'Flor de aragonita', text: 'A formação mais associada à identidade da caverna, com aparência escultural e única.' },
  { kicker: 'Gipsita', title: 'Agulhas de gipsita', text: 'Cristais alongados e delicados, um dos destaques mais conhecidos da Torrinha.' },
  { kicker: 'Calcita', title: 'Bolha de calcita', text: 'Uma formação que chama atenção pelo formato e pelo contexto geológico da galeria.' },
  { kicker: 'Parede natural', title: 'Cavidade', text: 'Leitura da rocha e dos vazios internos que estruturam o passeio e os salões.' },
  { kicker: 'Cristais', title: 'Cristalização', text: 'Detalhe dos minerais e do brilho característico de partes mais úmidas e claras.' },
  { kicker: 'Galeria interna', title: 'Detalhes da Torrinha', text: 'Texturas e formas naturais que revelam a riqueza geológica das galerias.' }
];

const updateDepth = () => {
  const doc = document.documentElement;
  const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
  const progress = Math.min(1, window.scrollY / scrollable);
  const meters = Math.round(progress * maxMeters);
  fill.style.height = `${progress * 100}%`;
  label.textContent = `${meters.toLocaleString('pt-BR')} m explorados`;
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });

const setBackground = (index) => {
  const next = index % bgImages.length;
  if (next === activeBgIndex) return;
  const layerIn = showingA ? bgB : bgA;
  const layerOut = showingA ? bgA : bgB;
  layerIn.style.backgroundImage = `url("${bgImages[next]}")`;
  layerIn.style.opacity = '1';
  layerOut.style.opacity = '0';
  activeBgIndex = next;
  showingA = !showingA;
};

const updateBackgroundMotion = () => {
  const t = window.scrollY * 0.03;
  const scale = 1.12;
  const offset = Math.sin(t) * 10;
  bgA.style.transform = `scale(${scale}) translate3d(0, ${offset}px, 0)`;
  bgB.style.transform = `scale(${scale}) translate3d(0, ${offset}px, 0)`;
};

const advanceBackground = () => {
  backgroundIndex = (backgroundIndex + 1) % bgImages.length;
  setBackground(backgroundIndex);
  updateBackgroundMotion();
};

const setMenuTheme = (dark) => {
  document.body.classList.toggle('menu-dark', dark);
  document.body.classList.toggle('menu-light', !dark);
  menuThemeToggle.setAttribute('aria-pressed', String(dark));
  menuThemeToggle.textContent = dark ? 'Menu claro' : 'Menu escuro';
};

const buildWhatsAppLink = () => {
  const nome = formNome.value.trim();
  const email = formEmail?.value.trim();
  const telefone = formTelefone?.value.trim();
  const mensagem = formMensagem.value.trim();
  const parts = [
    'Olá, vim pelo site da Caverna Torrinha.',
    nome ? `Nome: ${nome}` : null,
    email ? `E-mail: ${email}` : null,
    telefone ? `Telefone: ${telefone}` : null,
    mensagem ? `Mensagem: ${mensagem}` : null,
    getOrigem() ? `Origem: ${getOrigem()}` : null
  ].filter(Boolean);
  return `https://wa.me/5575998561666?text=${encodeURIComponent(parts.join('\n'))}`;
};

const renderRouteModal = (routeKey) => {
  const data = routeDetails[routeKey];
  if (!data) return;
  routeModalTrigger = document.activeElement;
  routeModalKicker.textContent = data.kicker;
  routeModalTitle.textContent = data.title;
  routeModalSummary.textContent = data.summary;
  routeModalGrid.innerHTML = data.stats.map(([label, value]) => `
    <div class="route-modal__stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join('');
  routeModalNotes.textContent = data.notes;
  const oldCta = routeModal.querySelector('.route-modal__whatsapp');
  oldCta?.remove();
  const cta = document.createElement('a');
  cta.className = 'btn btn-primary btn-whatsapp route-modal__whatsapp';
  cta.dataset.origem = `modal-${routeKey}`;
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.href = `https://wa.me/5575998561666?text=${encodeURIComponent(`Olá! Vi o site da Caverna Torrinha e quero reservar o ${data.kicker}.`)}`;
  cta.textContent = 'Reservar este roteiro no WhatsApp';
  routeModal.querySelector('.route-modal__panel').appendChild(cta);
  prepareWhatsApp(cta);
  routeModal.classList.add('is-open');
  routeModal.setAttribute('aria-hidden', 'false');
  routeModal.querySelector('.route-modal__close')?.focus();
};

const closeRouteModal = () => {
  routeModal.classList.remove('is-open');
  routeModal.setAttribute('aria-hidden', 'true');
  routeModalTrigger?.focus();
  routeModalTrigger = null;
};

const openLightbox = (index) => {
  const shot = galleryShots[index];
  if (!shot) return;
  lightboxTrigger = document.activeElement;
  const img = shot.querySelector('img');
  const info = galleryInfo[index] || galleryInfo[0];
  activeLightboxIndex = index;
  lightboxImg.src = shot.dataset.full || img.src;
  lightboxImg.alt = img.alt || '';
  lightboxLeftKicker.textContent = info.kicker;
  lightboxLeftTitle.textContent = info.title;
  lightboxLeftText.textContent = info.text;
  lightboxRightKicker.textContent = `Imagem ${index + 1} de ${galleryShots.length}`;
  lightboxRightTitle.textContent = img.alt || 'Foto ampliada';
  lightboxRightText.textContent = 'Use as setas para ir para a próxima ou anterior.';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightboxClose?.focus();
};

const stepLightbox = (direction) => {
  if (!galleryShots.length) return;
  const nextIndex = (activeLightboxIndex + direction + galleryShots.length) % galleryShots.length;
  openLightbox(nextIndex);
};

const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  lightboxTrigger?.focus();
  lightboxTrigger = null;
};

reveals.forEach(section => observer.observe(section));
window.addEventListener('scroll', updateDepth, { passive: true });
window.addEventListener('resize', updateDepth);
window.addEventListener('scroll', updateBackgroundMotion, { passive: true });
window.addEventListener('resize', updateBackgroundMotion);
cards.forEach((el, index) => {
  el.style.setProperty('--delay', `${Math.min(index * 70, 420)}ms`);
  el.addEventListener('mousemove', (event) => {
    if (el.classList.contains('shot')) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});
galleryShots.forEach((shot) => {
  shot.addEventListener('click', () => {
    openLightbox(galleryShots.indexOf(shot));
  });
});
routeCards.forEach((card) => {
  const open = () => renderRouteModal(card.dataset.route);
  card.addEventListener('click', (event) => {
    if (event.target.closest('.btn-whatsapp')) return;
    open();
  });
  card.addEventListener('keydown', (event) => {
    if (event.target !== card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => stepLightbox(-1));
lightboxNext.addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
routeModal.addEventListener('click', (event) => {
  if (event.target.hasAttribute('data-route-close')) closeRouteModal();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && aiChat?.classList.contains('is-open')) {
    aiChat.classList.remove('is-open');
    aiChat.setAttribute('aria-hidden', 'true');
    aiChatOpen?.focus();
  }
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'Escape') closeRouteModal();
  if (event.key === 'ArrowLeft' && lightbox.classList.contains('is-open')) stepLightbox(-1);
  if (event.key === 'ArrowRight' && lightbox.classList.contains('is-open')) stepLightbox(1);
});
bgA.style.backgroundImage = `url("${bgImages[0]}")`;
bgB.style.backgroundImage = `url("${bgImages[0]}")`;
bgA.style.opacity = '1';
bgB.style.opacity = '0';
bgA.style.transform = 'scale(1.12)';
bgB.style.transform = 'scale(1.12)';
setMenuTheme(true);
menuThemeToggle.addEventListener('click', () => {
  setMenuTheme(!document.body.classList.contains('menu-dark'));
});
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = buildWhatsAppLink();
  const data = { ...trackingData(), origem: getOrigem() };
  document.querySelectorAll('#contactForm input[type="hidden"]').forEach((field) => { field.value = currentUtm[field.name] || ''; });
  if (trackingConsent) { window.gtag('event', 'formulario_contato_enviado', { roteiro: data.roteiro || '' }); window.gtag('event', 'generate_lead', { roteiro: data.roteiro || '' }); sendConversion(); }
  window.open(url, '_blank', 'noopener');
});
updateDepth();
updateBackgroundMotion();
setBackground(0);
window.addEventListener('load', () => bgImages.slice(1).forEach((src) => { const image = new Image(); image.src = src; }));
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(min-width: 900px)').matches) setInterval(advanceBackground, 6500);
