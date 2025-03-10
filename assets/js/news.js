// Arquivo: assets/js/news.js

// Função para buscar notícias do Google Sheets
async function fetchNewsFromSheet() {
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
    
    return newsItems;
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    // Retornar dados de fallback em caso de erro
    return [
      {
        title: "Google apresenta novo modelo de IA com capacidades multilíngues avançadas",
        summary: "O novo modelo consegue traduzir e entender mais de 100 idiomas com precisão sem precedentes.",
        category: "Avanços Tecnológicos",
        image: "https://images.unsplash.com/photo-1679083216051-aa510a6a2e3b",
        date: "2025-03-08",
        url: "#"
      },
      // Adicione seus outros dados de fallback aqui
    ];
  }
}

// Função para renderizar notícias na página
function renderNews(newsItems, container = '.news-grid', limit = 3) {
  const newsGrid = document.querySelector(container);
  if (!newsGrid) return;
  
  newsGrid.innerHTML = '';
  
  // Limitar o número de notícias conforme solicitado
  const itemsToShow = newsItems.slice(0, limit);
  
  itemsToShow.forEach(news => {
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

// Inicializar o carregamento de notícias quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {
  if (document.querySelector('.news-grid')) {
    const newsItems = await fetchNewsFromSheet();
    renderNews(newsItems);
    
    // Armazenar os itens no localStorage para uso em outras páginas
    localStorage.setItem('newsItems', JSON.stringify(newsItems));
  }
});
