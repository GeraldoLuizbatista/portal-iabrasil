document.addEventListener('DOMContentLoaded', function() {
  // 1. Menu Mobile
  setupMobileMenu();
  
  // 2. Rolagem Suave (apenas para links internos)
  setupSmoothScroll();
  
  // 3. Filtros de Produtos
  setupProductFilters();
  
  // 4. Eventos de Formulário
  setupFormEvents();
});

// 1. Configurar menu mobile
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.menu');
  
  if (!mobileMenuBtn || !menu) return;
  
  mobileMenuBtn.addEventListener('click', function() {
    menu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
  
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    });
  });
}

// 2. Configurar rolagem suave (apenas para links internos)
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Ignorar links que são apenas "#" ou que têm classes específicas
    if (anchor.getAttribute('href') !== '#' && 
        !anchor.classList.contains('no-smooth-scroll')) {
      
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Verificar se é um link interno (não contém .html)
        if (href.includes('.html')) {
          return; // Deixa o link funcionar normalmente
        }
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Atualizar URL sem recarregar a página
          history.pushState(null, null, href);
        }
      });
    }
  });
}

// 3. Configurar filtros de produtos
function setupProductFilters() {
  const filterButtons = document.querySelectorAll('.category-filter');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('product-search');
  const noResultsMessage = document.querySelector('.no-results-message');
  
  if (filterButtons.length === 0 || productCards.length === 0) return;
  
  // Função para filtrar produtos
  function filterProducts(category, searchTerm = '') {
    let hasVisibleProducts = false;
    
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const productName = card.querySelector('h3').textContent.toLowerCase();
      const productDescription = card.querySelector('p').textContent.toLowerCase();
      
      const matchesCategory = category === 'all' || cardCategory === category;
      const matchesSearch = searchTerm === '' || 
                           productName.includes(searchTerm) || 
                           productDescription.includes(searchTerm);
      
      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        hasVisibleProducts = true;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Mostrar ou esconder mensagem de nenhum resultado
    if (noResultsMessage) {
      noResultsMessage.style.display = hasVisibleProducts ? 'none' : 'block';
    }
  }
  
  // Eventos dos botões de filtro
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      filterProducts(category, searchTerm);
    });
  });
  
  // Evento de busca
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const activeCategory = document.querySelector('.category-filter.active');
      const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
      const searchTerm = this.value.toLowerCase();
      
      filterProducts(category, searchTerm);
    });
  }
  
  // Evento do botão de busca
  const searchButton = document.querySelector('.search-button');
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const activeCategory = document.querySelector('.category-filter.active');
      const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
      const searchTerm = searchInput.value.toLowerCase();
      
      filterProducts(category, searchTerm);
    });
  }
}

// 4. Configurar eventos de formulário
function setupFormEvents() {
  const contactForm = document.getElementById('feedback-form');
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simular envio bem-sucedido
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Assinando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Inscrição na newsletter realizada com sucesso!');
        newsletterForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
}