// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados de notícias
    if (document.querySelector('.news-grid')) {
        loadNews();
    }
    
    // Carregar dados de produtos
    if (document.querySelector('.products-grid')) {
        loadProducts();
    }
    
    // Configurar eventos globais
    setupGlobalEvents();
});

async function loadNews() {
    try {
        const response = await fetch('./assets/data/news.json');
        const data = await response.json();
        
        // Limitar a 3 notícias para a página inicial
        const newsToShow = window.location.pathname.includes('noticias.html') 
            ? data.news 
            : data.news.slice(0, 3);
            
        renderNews(newsToShow);
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('./assets/data/products.json');
        const data = await response.json();
        
        // Limitar a 6 produtos para a página inicial
        const productsToShow = window.location.pathname.includes('produtos.html') 
            ? data.products 
            : data.products.slice(0, 6);
            
        renderProducts(productsToShow);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function renderNews(newsItems) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;
    
    newsGrid.innerHTML = '';
    
    newsItems.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        const formattedDate = new Date(news.date).toLocaleDateString('pt-BR');
        
        newsCard.innerHTML = `
            <div class="card-img">
                <img src="${news.image}" alt="${news.title}">
                <span class="category">${news.category}</span>
            </div>
            <div class="card-content">
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <div class="card-meta">
                    <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    <a href="${news.url}" class="read-more">Leia mais <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
        
        newsGrid.appendChild(newsCard);
    });
}

function renderProducts(productItems) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productItems.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', getCategorySlug(product.category));
        
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
    
    // Ativar o filtro
    setupProductFilters();
}

function getCategorySlug(category) {
    return category
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
}

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

function setupGlobalEvents() {
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    
    if (mobileMenuBtn && menu) {
        mobileMenuBtn.addEventListener('click', function() {
            menu.classList.toggle('active');
            // Adicione código para animação do botão se necessário
        });
    }
    
    // Formulários
    setupForms();
    
    // Links de rolagem suave
    setupSmoothScroll();
}

function setupForms() {
    const contactForm = document.getElementById('feedback-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Código para processar o formulário de contato
            showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Código para processar o formulário de newsletter
            showToast('Inscrição realizada com sucesso! Você receberá nossas atualizações em breve.');
            this.reset();
        });
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function showToast(message) {
    // Criar elemento toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Adicionar estilo inline
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    
    // Adicionar ao corpo do documento
    document.body.appendChild(toast);
    
    // Exibir o toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Remover após 5 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}
