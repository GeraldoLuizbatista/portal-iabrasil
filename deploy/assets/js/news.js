// Configuração de feeds RSS em português
const RSS_FEEDS = {
    'avanços-tecnológicos': [
        'https://canaltech.com.br/rss/inteligencia-artificial/',
        'https://www.tecmundo.com.br/feed'
    ],
    'ia-no-brasil': [
        'https://www.startse.com/feed/rss/artificial-intelligence',
        'https://www.uol.com.br/tilt/ultimas-noticias/rss.xml'
    ],
    'pesquisa-e-desenvolvimento': [
        'https://www.fapesp.br/rss/noticias',
        'https://www.ufmg.br/noticias/rss/'
    ],
    'impacto-social': [
        'https://www.bbc.com/portuguese/topics/ckdxnwvvzy2t/index.xml',
        'https://www.nexojornal.com.br/rss'
    ]
};

// Dados estáticos de fallback
const FALLBACK_NEWS = [
    {
        title: "Google apresenta novo modelo de IA com capacidades multilíngues avançadas",
        summary: "O novo modelo consegue traduzir e entender mais de 100 idiomas com precisão sem precedentes.",
        category: "Avanços Tecnológicos",
        image: "https://via.placeholder.com/350x200",
        date: "2025-03-08",
        url: "#"
    },
    {
        title: "Startup brasileira desenvolve IA para otimização do agronegócio",
        summary: "A solução promete aumentar a produtividade em até 30% usando análise inteligente de dados.",
        category: "IA no Brasil",
        image: "https://via.placeholder.com/350x200",
        date: "2025-03-05",
        url: "#"
    },
    {
        title: "União Europeia propõe novas diretrizes para regulação de IA",
        summary: "As novas regras visam garantir desenvolvimento ético e seguro de tecnologias de inteligência artificial.",
        category: "Regulamentações e Ética",
        image: "https://via.placeholder.com/350x200",
        date: "2025-03-02",
        url: "#"
    }
];

// Cache de notícias
let newsCache = {
    data: null,
    timestamp: 0,
    expires: 15 * 60 * 1000 // 15 minutos
};

// Função para buscar feeds RSS
async function fetchRSSFeeds(category = 'all') {
    // Verificar cache
    const now = Date.now();
    if (newsCache.data && now - newsCache.timestamp < newsCache.expires) {
        return filterNewsByCategory(newsCache.data, category);
    }
    
    console.log('Buscando notícias RSS...');
    const allItems = [];
    const feeds = category === 'all' 
        ? Object.values(RSS_FEEDS).flat() 
        : RSS_FEEDS[category] || [];
    
    // Se não houver feeds para a categoria, retornar vazio
    if (feeds.length === 0) return [];
    
    let successCount = 0;
    
    for (const feedUrl of feeds) {
        try {
            // Usar proxy CORS para evitar problemas de mesma origem
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) continue;
            
            const data = await response.json();
            const xmlContent = data.contents;
            
            if (!xmlContent) continue;
            
            // Converter XML para JSON
            const items = parseRSSXml(xmlContent);
            if (items && items.length > 0) {
                allItems.push(...items);
                successCount++;
            }
        } catch (error) {
            console.error('Erro ao buscar feed:', feedUrl, error);
        }
    }
    
    // Se não conseguiu buscar nenhum feed, retornar null para usar fallback
    if (successCount === 0) {
        return null;
    }
    
    // Ordenar por data
    const sortedItems = allItems.sort((a, b) => 
        new Date(b.pubDate) - new Date(a.pubDate)
    );
    
    // Atualizar cache
    newsCache = {
        data: sortedItems,
        timestamp: Date.now(),
        expires: 15 * 60 * 1000
    };
    
    return filterNewsByCategory(sortedItems, category);
}

// Parse XML para JSON
function parseRSSXml(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const items = xmlDoc.querySelectorAll('item');
    const result = [];
    
    items.forEach(item => {
        try {
            const title = item.querySelector('title')?.textContent || 'Sem título';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '#';
            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
            const category = item.querySelector('category')?.textContent || 'Geral';
            
            // Extrair imagem do conteúdo
            let imageUrl = 'https://via.placeholder.com/350x200';
            const enclosure = item.querySelector('enclosure');
            if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
                imageUrl = enclosure.getAttribute('url') || imageUrl;
            } else {
                // Tentar encontrar imagem no conteúdo
                const content = item.querySelector('content\\:encoded')?.textContent || description;
                const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch && imgMatch[1]) {
                    imageUrl = imgMatch[1];
                }
            }
            
            result.push({
                title,
                description: cleanHtmlTags(description).substring(0, 150) + '...',
                url: link,
                pubDate,
                category,
                image: imageUrl
            });
        } catch (error) {
            console.error('Erro ao parsear item RSS:', error);
        }
    });
    
    return result;
}

// Limpar tags HTML do conteúdo
function cleanHtmlTags(text) {
    return text.replace(/<[^>]*>/g, '');
}

// Filtrar notícias por categoria
function filterNewsByCategory(news, category) {
    if (category === 'all' || !news) return news;
    
    const categoryMap = {
        'avanços-tecnológicos': ['tecnologia', 'inovação', 'avanço', 'tecnológico'],
        'ia-no-brasil': ['brasil', 'brasileira', 'brasileiro', 'são paulo', 'rio de janeiro'],
        'regulamentações-e-ética': ['regulamentação', 'lei', 'ético', 'ética', 'governo'],
        'pesquisa-e-desenvolvimento': ['pesquisa', 'desenvolvimento', 'científico', 'universidade'],
        'impacto-social': ['social', 'sociedade', 'impacto', 'emprego', 'trabalho']
    };
    
    const keywords = categoryMap[category] || [];
    return news.filter(item => {
        const content = `${item.title} ${item.description}`.toLowerCase();
        return keywords.some(keyword => content.includes(keyword.toLowerCase()));
    });
}

// Renderizar notícias
function renderNews(news, containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container com ID ${containerId} não encontrado`);
        return;
    }
    
    // Limpar o contêiner
    container.innerHTML = '';
    
    const newsToRender = limit ? news.slice(0, limit) : news;
    
    if (newsToRender.length === 0) {
        container.innerHTML = `
            <div class="no-news">
                <i class="fas fa-newspaper"></i>
                <h3>Nenhuma notícia encontrada</h3>
                <p>Tente novamente mais tarde ou verifique outras categorias.</p>
            </div>
        `;
        return;
    }
    
    newsToRender.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        // Formatar data
        const pubDate = new Date(item.pubDate);
        const formattedDate = pubDate.toLocaleDateString('pt-BR');
        
        newsCard.innerHTML = `
            <div class="card-img">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/350x200'">
                <span class="category">${item.category}</span>
            </div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-meta">
                    <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    <a href="${item.url}" class="read-more" target="_blank" rel="noopener">
                        Leia mais <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        
        container.appendChild(newsCard);
    });
}

// Função principal para carregar notícias
async function loadNews() {
    const newsGrid = document.getElementById('noticias-destaque-container');
    const allNewsContainer = document.getElementById('todas-noticias-container');
    
    try {
        // Tentar carregar notícias RSS
        let newsData = await fetchRSSFeeds('all');
        
        // Se não conseguir, usar fallback
        if (!newsData) {
            console.log('Usando notícias de fallback');
            newsData = FALLBACK_NEWS.map(item => ({
                ...item,
                pubDate: item.date
            }));
        }
        
        // Renderizar notícias na página principal (apenas 3)
        if (newsGrid) {
            renderNews(newsData, 'noticias-destaque-container', 3);
        }
        
        // Renderizar todas as notícias na página de notícias
        if (allNewsContainer) {
            renderNews(newsData, 'todas-noticias-container');
            setupCategoryFilters();
        }
        
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        
        // Em caso de erro, usar fallback
        if (newsGrid) {
            renderNews(FALLBACK_NEWS.map(item => ({
                ...item,
                pubDate: item.date
            })), 'noticias-destaque-container', 3);
        }
        
        if (allNewsContainer) {
            renderNews(FALLBACK_NEWS.map(item => ({
                ...item,
                pubDate: item.date
            })), 'todas-noticias-container');
        }
    }
}

// Configurar filtros de categoria
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const container = document.getElementById('todas-noticias-container');
    
    if (!filterButtons.length || !container) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Atualizar UI
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar loading
            container.innerHTML = '<div class="loading">Carregando notícias...</div>';
            
            // Buscar notícias da categoria
            const category = this.dataset.category;
            let newsData = await fetchRSSFeeds(category);
            
            // Se não conseguir, usar fallback filtrado
            if (!newsData) {
                newsData = FALLBACK_NEWS.filter(item => 
                    item.category.toLowerCase().includes(category) || category === 'all'
                ).map(item => ({
                    ...item,
                    pubDate: item.date
                }));
            }
            
            // Renderizar notícias
            renderNews(newsData, 'todas-noticias-container');
        });
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de notícias
    if (window.location.pathname.includes('noticias.html')) {
        loadNewsFromUrl();
    } else {
        // Página principal - carregar apenas 3 notícias
        loadNews();
    }
});

// Função para processar parâmetros da URL
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    
    return params;
}

// Função para carregar notícias com base nos parâmetros da URL
async function loadNewsFromUrl() {
    const params = getUrlParams();
    const category = params.category || 'all';
    
    const allNewsContainer = document.getElementById('todas-noticias-container');
    if (!allNewsContainer) return;
    
    try {
        let newsData = await fetchRSSFeeds(category);
        
        if (!newsData) {
            newsData = FALLBACK_NEWS.filter(item => 
                category === 'all' || item.category.toLowerCase().includes(category)
            ).map(item => ({
                ...item,
                pubDate: item.date
            }));
        }
        
        renderNews(newsData, 'todas-noticias-container');
        
        // Atualizar contador
        if (document.getElementById('news-shown')) {
            document.getElementById('news-shown').textContent = newsData.length;
            document.getElementById('news-total').textContent = newsData.length;
        }
        
        // Ativar o filtro correspondente
        const filterBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (filterBtn) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            filterBtn.classList.add('active');
        }
        
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        
        // Usar fallback em caso de erro
        const fallbackData = FALLBACK_NEWS.filter(item => 
            category === 'all' || item.category.toLowerCase().includes(category)
        ).map(item => ({
            ...item,
            pubDate: item.date
        }));
        
        renderNews(fallbackData, 'todas-noticias-container');
    }
}