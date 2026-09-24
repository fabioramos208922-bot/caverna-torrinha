const fill = document.getElementById('depthFill');
const label = document.getElementById('depthLabel');
const bgA = document.getElementById('bgLayerA');
const bgB = document.getElementById('bgLayerB');
const menuThemeToggle = document.getElementById('menuThemeToggle');
const whatsForm = document.getElementById('whatsForm');
const formNome = document.getElementById('nome');
const formEmail = document.getElementById('email');
const formTelefone = document.getElementById('telefone');
const formMensagem = document.getElementById('mensagem');
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
const routeCards = Array.from(document.querySelectorAll('.route[data-route]'));
const bgImages = [
  'assets/3flor.jpg',
  'assets/agulha (1).jpg',
  'assets/bolha.jpg',
  'assets/cavidade.jpg',
  'assets/cristal.png',
  'assets/drinki.jpg',
  'assets/flor.png',
  'assets/salao branco.jpg',
  'assets/vulcao.jpg'
];
let activeBgIndex = -1;
let showingA = true;
let backgroundIndex = 0;
let activeLightboxIndex = 0;
const routeDetails = {
  capitao: {
    kicker: 'Roteiro do Capitão',
    title: 'O percurso mais histórico',
    summary: 'Esse é o roteiro ideal para quem quer sentir a origem da exploração da Torrinha, com caminhada mais curta e leitura clara das formações clássicas.',
    stats: [['Acesso a pé', 'Cerca de 700 m'], ['Duração', 'Aproximadamente 1h'], ['Esforço', 'Leve'], ['Perfil', 'Primeira visita']],
    notes: 'Pontos fortes: estalactites, estalagmites, colunas e cortinas. Ótimo para uma visita introdutória sem perder a atmosfera da caverna.'
  },
  valery: {
    kicker: 'Roteiro Valery',
    title: 'O percurso mais fotogênico',
    summary: 'Voltado para formações raras e enquadramentos mais impressionantes, com destaque para detalhes delicados e cristais curiosos.',
    stats: [['Acesso a pé', 'Cerca de 1,2 km'], ['Duração', 'Aproximadamente 1h30'], ['Esforço', 'Moderado'], ['Perfil', 'Melhor para fotos']],
    notes: 'Pontos fortes: flores de aragonita, helictites e agulhas de gipsita. Boa escolha para quem quer ver mais variedade geológica.'
  },
  raridades: {
    kicker: 'Roteiro das Raridades',
    title: 'O percurso mais detalhado',
    summary: 'Esse roteiro junta algumas das formações mais incomuns da Torrinha em um trajeto pensado para quem quer observar tudo com calma.',
    stats: [['Destaque', 'Bolha de calcita com flor'], ['Duração', 'Roteiro mais analítico'], ['Experiência', 'Salões internos'], ['Foco', 'Formações raras']],
    notes: 'Inclui o Salão dos Vulcões, helictite com flor na ponta e a réplica do Morro do Pai Inácio. É o roteiro para quem curte detalhes e curiosidades.'
  },
  completo: {
    kicker: 'Roteiro Completo',
    title: 'A experiência mais ampla',
    summary: 'Une os trechos principais e entrega a leitura mais completa da caverna, com um panorama mais rico da Torrinha como um todo.',
    stats: [['Acesso', 'Cerca de 1,6 km'], ['Duração', 'Até 2h30'], ['Esforço', 'Moderado a avançado'], ['Perfil', 'Imersão total']],
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
  { kicker: 'Paisagem interna', title: 'Formação adicional', text: 'Mais uma visão da caverna para variar o passeio visual entre uma imagem e outra.' }
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
  const email = formEmail.value.trim();
  const telefone = formTelefone.value.trim();
  const mensagem = formMensagem.value.trim();
  const parts = [
    'Olá, vim pelo site da Caverna Torrinha.',
    nome ? `Nome: ${nome}` : null,
    email ? `E-mail: ${email}` : null,
    telefone ? `Telefone: ${telefone}` : null,
    mensagem ? `Mensagem: ${mensagem}` : null
  ].filter(Boolean);
  return `https://wa.me/5575998561666?text=${encodeURIComponent(parts.join('\n'))}`;
};

const renderRouteModal = (routeKey) => {
  const data = routeDetails[routeKey];
  if (!data) return;
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
  routeModal.classList.add('is-open');
  routeModal.setAttribute('aria-hidden', 'false');
};

const closeRouteModal = () => {
  routeModal.classList.remove('is-open');
  routeModal.setAttribute('aria-hidden', 'true');
};

const openLightbox = (index) => {
  const shot = galleryShots[index];
  if (!shot) return;
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
  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
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
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'Escape') closeRouteModal();
  if (event.key === 'ArrowLeft' && lightbox.classList.contains('is-open')) stepLightbox(-1);
  if (event.key === 'ArrowRight' && lightbox.classList.contains('is-open')) stepLightbox(1);
});
bgA.style.backgroundImage = `url("${bgImages[0]}")`;
bgB.style.backgroundImage = `url("${bgImages[1] || bgImages[0]}")`;
bgA.style.opacity = '1';
bgB.style.opacity = '0';
bgA.style.transform = 'scale(1.12)';
bgB.style.transform = 'scale(1.12)';
setMenuTheme(true);
menuThemeToggle.addEventListener('click', () => {
  setMenuTheme(!document.body.classList.contains('menu-dark'));
});
whatsForm.addEventListener('click', () => {
  whatsForm.href = buildWhatsAppLink();
});
updateDepth();
updateBackgroundMotion();
setBackground(0);
setInterval(advanceBackground, 6500);
