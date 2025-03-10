// Arquivo: assets/js/products.js

// Dados de produtos (para um MVP, podemos manter os dados no próprio JS)
// Em uma versão futura, isso viria de uma API ou Airtable
const productsList = [
  {
    id: 1,
    name: "MidJourney",
    description: "Gerador de imagens baseado em prompts de texto com qualidade excepcional.",
    category: "IA para Imagens",
    categorySlug: "ia-para-imagens",
    image: "https://images.unsplash.com/photo-1688989487185-3ba1e63e05ed",
    tags: ["Imagens", "Arte", "Design"],
    url: "#"
  },
  {
    id: 2,
    name: "ZenAnalytics",
    description: "Plataforma de análise de dados empresariais com IA para insights automatizados.",
    category: "IA para Negócios",
    categorySlug: "ia-para-negocios",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    tags: ["Negócios", "Análise", "Dados"],
    url: "#"
  },
  // Adicione outros produtos aqui
];

// Função para renderizar produtos
function renderProducts(products, container = '.products-grid', limit = 6) {
  const productsGrid = document.querySelector(container);
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  // Limitar o número de produtos conforme solicitado
  const itemsToShow = products.slice(0, limit);
  
  itemsToShow.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.categorySlug);
    
    const tagsHTML = product.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    productCard.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}">
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
}

// Função para configurar a busca de produtos
function setupProductSearch() {
  // Verificar se o contêiner de busca existe
  const searchContainer = document.querySelector('.search-container');
  if (!searchContainer) return;
  
  const searchInput = document.getElementById('product-search');
  const searchButton = document.querySelector('.search-button');
  
  // Evento de busca
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    let resultsFound = false;
    
    productCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
      
      // Verificar se o termo de busca está presente em qualquer um dos campos
      if (title.includes(searchTerm) || description.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
        card.style.display = 'block';
        resultsFound = true;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Mostrar mensagem se nenhum resultado for encontrado
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
      noResultsMsg.style.display = resultsFound ? 'none' : 'block';
    }
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.products-grid')) {
    renderProducts(productsList);
    setupProductSearch();
    setupProductFilters();
  }
});

// Certifique-se de que o seguinte código esteja no seu arquivo products.js:
function setupProductFilters() {
  const filters = document.querySelectorAll('.category-filter');
  if (filters.length === 0) return;
  
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
        if (selectedCategory === 'all' || product.getAttribute('data-category') === selectedCategory) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });
}

// Chamar a função quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupProductFilters);
