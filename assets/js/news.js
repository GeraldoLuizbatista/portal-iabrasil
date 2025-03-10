// Arquivo: assets/js/news.js

// Dados estáticos de notícias para garantir que algo seja exibido
const staticNewsItems = [
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

// Flag para evitar múltiplas renderizações
let hasRenderedStaticNews = false;

// Função para buscar notícias do Google Sheets
async function fetchNewsFromSheet() {
  // Se já renderizamos as notícias estáticas e estamos em desenvolvimento, retornar
  if (hasRenderedStaticNews && window.location.hostname === 'localhost') {
    console.log("Desenvolvimento local detectado, ignorando chamada ao Google Sheets");
    return staticNewsItems;
  }

  const sheetId = "SEU_ID_DA_PLANILHA"; // Substitua pelo ID da sua planilha
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();
    // O Google Sheets retorna um estranho formato JSON com prefixo, então precisamos limpá-lo
    const data = JSON.parse(text.substring(47).slice(0, -2));
    
    // Converter dados da planilha para o formato necessário
    const newsItems = data.table.rows.map(row => {
      return {
        title: row.c[0] ? row.c[0].v : "Sem título",
        summary: row.c[1] ? row.c[1].v : "Sem resumo",
        category: row.c[2] ? row.c[2].v : "Sem categoria",
        image: row.c[3] ? row.c[3].v : "https://via.placeholder.com/350x200",
        date: row.c[4] ? new Date(row.c[4].v).toISOString().split('T')[0] : "2025-01-01",
        url: row.c[5] ? row.c[5].v : "#"
      };
    });
    
    return newsItems.length > 0 ? newsItems : staticNewsItems;
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    // Retornar dados estáticos em caso de erro
    return staticNewsItems;
  }
}

// Função para renderizar notícias na página
function renderNews(newsItems, container = '.news-grid', limit = 3) {
  const newsGrid = document.querySelector(container);
  if (!newsGrid) {
    console.error("Contêiner de notícias não encontrado:", container);
    return;
  }
  
  // Importante: Verificar se já temos notícias renderizadas e em quantidade correta
  const existingCards = newsGrid.querySelectorAll('.news-card');
  if (existingCards.length >= limit) {
    console.log(`Já existem ${existingCards.length} notícias renderizadas. Ignorando.`);
    return;
  }
  
  // Limpar o contêiner antes de adicionar as notícias
  newsGrid.innerHTML = '';
  
  // Limitar o número de notícias conforme solicitado
  const itemsToShow = newsItems.slice(0, limit);
  
  // Se não houver notícias, mostrar mensagem
  if (itemsToShow.length === 0) {
    newsGrid.innerHTML = '<p class="no-news">Nenhuma notícia disponível no momento.</p>';
    return;
  }
  
  // Adicionar cada notícia ao contêiner
  itemsToShow.forEach(news => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    
    // Formatar a data no formato brasileiro
    const date = new Date(news.date);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
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
  
  // Marcar que renderizamos as notícias estáticas
  hasRenderedStaticNews = true;
  
  console.log(`Renderizadas ${itemsToShow.length} notícias no contêiner ${container}`);
}

// Inicializar o carregamento de notícias quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM carregado, inicializando notícias...");
  
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid) {
    console.error("Contêiner de notícias não encontrado!");
    return;
  }
  
  // Verificar se já existem notícias no HTML
  const existingCards = newsGrid.querySelectorAll('.news-card');
  if (existingCards.length > 0) {
    console.log(`Detectadas ${existingCards.length} notícias já no HTML. Respeitando.`);
    return; // Não interfira se já houver notícias
  }
  
  // Renderizar notícias estáticas imediatamente
  renderNews(staticNewsItems);
  
  // Tentar buscar do Google Sheets apenas se tivermos um ID configurado
  if (typeof sheetId !== 'undefined' && sheetId !== '2PACX-1vRR8xV7akM0H9514HrMa1DjryGsGirRWmtrMg4Jo9WysmgM0QUh6IdEg6RmZ7no_HO771AfkqFqI95b') {
    fetchNewsFromSheet().then(newsItems => {
      if (newsItems.length > 0 && !document.hidden) {
        renderNews(newsItems);
      }
    }).catch(error => {
      console.error("Erro ao processar notícias da planilha:", error);
    });
  }
});

// Evitar problemas com múltiplas chamadas
window.addEventListener('load', function() {
  // Certificar-se de que temos 3 notícias após o carregamento completo
  const newsGrid = document.querySelector('.news-grid');
  if (newsGrid) {
    const cards = newsGrid.querySelectorAll('.news-card');
    if (cards.length !== 3) {
      console.log("Verificação final: número incorreto de notícias. Corrigindo...");
      renderNews(staticNewsItems);
    }
  }
});
