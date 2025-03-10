document.addEventListener('DOMContentLoaded', function() {
  // 1. Renderização de Notícias
  renderNews();
  
  // 2. Filtros de Produtos
  setupProductFilters();
  
  // 3. Menu Mobile
  setupMobileMenu();
  
  // 4. Rolagem Suave
  setupSmoothScroll();
  
  // 5. Eventos de Formulário
  setupFormEvents();
});

// 1. Função para renderizar notícias
function renderNews() {
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid) return;
  
  // Dados estáticos de notícias
  const newsItems = [
    // Adicione aqui os dados das 3 notícias
  ];
  
  // Limpar e renderizar
  newsGrid.innerHTML = '';
  newsItems.forEach(news => {
    // Código de renderização
  });
}

// 2. Configurar filtros de produtos
function setupProductFilters() {
  const filterButtons = document.querySelectorAll('.category-filter');
  const productCards = document.querySelectorAll('.product-card');
  
  if (filterButtons.length === 0 || productCards.length === 0) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Código de filtragem
    });
  });
}

// 3. Configurar menu mobile
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.menu');
  
  if (!mobileMenuBtn || !menu) return;
  
  mobileMenuBtn.addEventListener('click', function() {
    // Código do menu mobile
  });
}

// 4. Configurar rolagem suave
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Código de rolagem suave
    });
  });
}

// 5. Configurar eventos de formulário
function setupFormEvents() {
  const contactForm = document.getElementById('feedback-form');
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Deixar o Formspree lidar com o envio
    });
  }
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      // Deixar o TinyLetter lidar com o envio
    });
  }
}
