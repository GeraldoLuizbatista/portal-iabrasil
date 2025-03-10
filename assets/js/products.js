// Arquivo: assets/js/products.js
document.addEventListener('DOMContentLoaded', function() {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;
  
  // Produtos estáticos para o MVP
  const products = [
    {
      name: "MidJourney",
      description: "Gerador de imagens baseado em prompts de texto com qualidade excepcional.",
      category: "IA para Imagens",
      categorySlug: "ia-para-imagens",
      image: "https://via.placeholder.com/300x200",
      tags: ["Imagens", "Arte", "Design"],
      url: "#"
    },
    {
      name: "ZenAnalytics",
      description: "Plataforma de análise de dados empresariais com IA para insights automatizados.",
      category: "IA para Negócios",
      categorySlug: "ia-para-negocios",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      tags: ["Negócios", "Análise", "Dados"],
      url: "#"
    },
    {
      name: "CodePilot",
      description: "Assistente de programação que ajuda desenvolvedores a escrever código mais rápido.",
      category: "IA para Desenvolvedores",
      categorySlug: "ia-para-desenvolvedores",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      tags: ["Desenvolvimento", "Código", "Produtividade"],
      url: "#"
    },
    {
      name: "EduLearn AI",
      description: "Plataforma educacional adaptativa que personaliza o aprendizado para cada estudante.",
      category: "IA para Educação",
      categorySlug: "ia-para-educacao",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      tags: ["Educação", "Aprendizado", "Personalização"],
      url: "#"
    },
    {
      name: "MediScan",
      description: "Sistema de diagnóstico por imagem que auxilia médicos na detecção precoce de doenças.",
      category: "IA para Saúde",
      categorySlug: "ia-para-saude",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
      tags: ["Saúde", "Diagnóstico", "Medicina"],
      url: "#"
    },
    {
      name: "CustomerAI",
      description: "Plataforma de atendimento ao cliente com chatbots inteligentes e análise de sentimento.",
      category: "IA para Negócios", 
      categorySlug: "ia-para-negocios",
      image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387",
      tags: ["Negócios", "Atendimento", "Chatbot"],
      url: "#"
    }
  ];
  
  // Limpar o grid de produtos
  productsGrid.innerHTML = '';
  
  // Renderizar todos os produtos
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.categorySlug);
    
    const tagsHTML = product.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    productCard.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Produto'">
      </div>
      <div class="product-content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-tags">
          ${tagsHTML}
        </div>
        <a href="${product.url}" class="btn small">Saiba mais</a>
      </div>
    `;
    
    productsGrid.appendChild(productCard);
  });
  
  // Configurar filtros de categoria
  setupProductFilters();
});

// Função para configurar filtros de categoria
function setupProductFilters() {
  const filters = document.querySelectorAll('.category-filter');
  if (filters.length === 0) return;
  
  // Garantir que "Todos" esteja ativo inicialmente
  document.querySelector('.category-filter[data-category="all"]')?.classList.add('active');
  
  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Remover classe active de todos os filtros
      filters.forEach(btn => btn.classList.remove('active'));
      
      // Adicionar classe active ao filtro clicado
      this.classList.add('active');
      
      // Obter a categoria selecionada
      const selectedCategory = this.getAttribute('data-category');
      
      // Filtrar os produtos
      const products = document.querySelectorAll('.product-card');
      
      products.forEach(product => {
        if (selectedCategory === 'all') {
          product.style.display = 'block';
        } else {
          if (product.getAttribute('data-category') === selectedCategory) {
            product.style.display = 'block';
          } else {
            product.style.display = 'none';
          }
        }
      });
    });
  });
}

// Implementar a funcionalidade de busca
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('input[placeholder="Buscar produtos e empresas..."]');
  const searchButton = searchInput?.nextElementSibling;
  
  if (searchInput && searchButton) {
    // Função de busca
    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase();
      if (!searchTerm) return;
      
      const productCards = document.querySelectorAll('.product-card');
      let resultsFound = false;
      
      productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        if (title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            tags.some(tag => tag.includes(searchTerm))) {
          card.style.display = 'block';
          resultsFound = true;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Reset dos filtros de categoria
      document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.category-filter[data-category="all"]')?.classList.add('active');
    }
    
    // Evento de clique no botão de busca
    searchButton.addEventListener('click', performSearch);
    
    // Evento de pressionar Enter no campo de busca
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
});
