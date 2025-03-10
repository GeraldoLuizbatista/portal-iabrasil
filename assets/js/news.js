document.addEventListener('DOMContentLoaded', function() {
  const newsGrid = document.querySelector('.news-grid');
  if (!newsGrid) return;
  
  // Dados estáticos de notícias para garantir que algo seja exibido
  const newsItems = [
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
  
  // Limpar o contêiner antes de adicionar as notícias
  newsGrid.innerHTML = '';
  
  // Adicionar cada notícia ao contêiner
  newsItems.forEach(news => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    
    // Formatar a data no formato brasileiro
    const parts = news.date.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    
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
});
