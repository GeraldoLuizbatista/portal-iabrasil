// Aguardar que o DOM esteja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Variáveis para elementos do DOM que serão manipulados
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const productCards = document.querySelectorAll('.product-card');
    const contactForm = document.getElementById('feedback-form');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Toggle do menu mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Alterna a classe active no menu
            menu.classList.toggle('active');
            
            // Animação para o botão do menu
            const bars = this.querySelectorAll('.bar');
            bars[0].classList.toggle('active');
            bars[1].classList.toggle('active');
            bars[2].classList.toggle('active');
            
            // Adiciona estilo para barras do menu quando ativo
            if (menu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Detectar link ativo com base na rolagem da página
    function setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                document.querySelector('.menu a[href="#' + sectionId + '"]')?.classList.add('active');
            } else {
                document.querySelector('.menu a[href="#' + sectionId + '"]')?.classList.remove('active');
            }
        });
    }

    // Adicionar evento de rolagem para detectar seção ativa
    window.addEventListener('scroll', setActiveLink);

    // Filtro de categorias para produtos
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remover classe active de todos os filtros
                categoryFilters.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar classe active ao filtro clicado
                this.classList.add('active');
                
                // Obter a categoria selecionada
                const selectedCategory = this.getAttribute('data-category');
                
                // Filtrar os produtos
                productCards.forEach(card => {
                    if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Manipular envio do formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter valores dos campos
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Em um MVP real, aqui seria o código para enviar os dados para um backend
            // Para o MVP simples, vamos apenas exibir uma mensagem de confirmação
            
            // Simulando um envio com um temporizador
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            setTimeout(() => {
                // Limpar o formulário
                this.reset();
                
                // Restaurar o botão
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';
                
                // Exibir uma mensagem de confirmação
                showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            }, 1500);
        });
    }

    // Manipular envio do formulário de newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulando um envio com um temporizador
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processando...';
            
            setTimeout(() => {
                // Limpar o formulário
                this.reset();
                
                // Restaurar o botão
                submitBtn.disabled = false;
                submitBtn.textContent = 'Assinar';
                
                // Exibir uma mensagem de confirmação
                showToast('Inscrição realizada com sucesso! Você receberá nossas atualizações em breve.');
            }, 1500);
        });
    }

    // Função para exibir mensagens de notificação
    function showToast(message) {
        // Criar elemento toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Adicionar estilo inline ao toast
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
            
            // Remover elemento após a animação
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }

    // Script para animação de contagem de estatísticas
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            // Obter o valor final do número
            const targetValue = parseInt(stat.textContent);
            // Iniciar de zero
            let currentValue = 0;
            // Duração da animação em milissegundos
            const duration = 2000;
            // Número de etapas
            const steps = 60;
            // Intervalo entre cada etapa
            const interval = duration / steps;
            // Incremento por etapa
            const increment = targetValue / steps;
            
            // Remover o "+" se existir
            stat.textContent = '0';
            
            // Função para animar o número
            const updateNumber = () => {
                currentValue += increment;
                
                // Verificar se ultrapassou o valor alvo
                if (currentValue >= targetValue) {
                    // Se o texto original continha "+", adicioná-lo de volta
                    if (stat.textContent.includes('+')) {
                        stat.textContent = Math.floor(targetValue) + '+';
                    } else {
                        stat.textContent = Math.floor(targetValue);
                    }
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            };
            
            // Iniciar a animação
            const timer = setInterval(updateNumber, interval);
        });
    }

    // Verificar quando a seção de estatísticas está visível e iniciar a animação
    function checkStatsVisibility() {
        const statsSection = document.querySelector('.about-stats');
        
        if (statsSection) {
            const sectionPosition = statsSection.getBoundingClientRect();
            const screenPosition = window.innerHeight;
            
            if (sectionPosition.top < screenPosition && sectionPosition.bottom >= 0) {
                animateNumbers();
                // Remover o evento após a animação ser iniciada
                window.removeEventListener('scroll', checkStatsVisibility);
            }
        }
    }

    // Adicionar evento de rolagem para verificar visibilidade das estatísticas
    window.addEventListener('scroll', checkStatsVisibility);
    // Verificar também no carregamento da página
    checkStatsVisibility();

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Fechar o menu mobile, se estiver aberto
            if (menu.classList.contains('active')) {
                mobileMenuBtn.click();
            }
            
            // Obter o alvo da âncora
            const targetId = this.getAttribute('href');
            
            // Se o alvo for apenas #, rolar para o topo
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Carregar mais notícias (simulação para o MVP)
    const loadMoreNewsBtn = document.querySelector('.section-footer .btn');
    
    if (loadMoreNewsBtn && loadMoreNewsBtn.parentElement.parentElement.id === 'noticias-destaque') {
        let newsCount = 1;
        
        loadMoreNewsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular carregamento
            this.textContent = 'Carregando...';
            
            setTimeout(() => {
                // Limitar a apenas uma carga adicional para o MVP
                if (newsCount === 1) {
                    // Clonar os cards de notícias existentes
                    const newsGrid = document.querySelector('.news-grid');
                    const newsCards = document.querySelectorAll('.news-card');
                    
                    // Adicionar novos cards (clones com títulos diferentes)
                    newsCards.forEach(card => {
                        const newCard = card.cloneNode(true);
                        const title = newCard.querySelector('h3');
                        
                        // Alterar o título para simular novos conteúdos
                        title.textContent = 'Nova notícia: ' + title.textContent;
                        
                        // Alterar a data para simular novos conteúdos
                        const date = newCard.querySelector('.card-meta span');
                        const dateText = date.textContent.replace('08/03/2025', '01/03/2025');
                        date.textContent = dateText;
                        
                        // Adicionar o novo card à grade
                        newsGrid.appendChild(newCard);
                    });
                    
                    newsCount++;
                    this.textContent = 'Ver todas as notícias';
                } else {
                    // Na segunda vez, redirecionar para a página de notícias
                    window.location.href = '#noticias';
                }
            }, 1000);
        });
    }

    // Adicionar funcionalidade de pesquisa (para futuras implementações)
    // Este código pode ser expandido no futuro para adicionar um campo de pesquisa real
    
    // Inicializar o AOS (Animate on Scroll) se necessário no futuro
    // Isso pode ser adicionado em uma versão posterior para melhorar as animações
});

// Adicionar um evento de carregamento da página para remover classes de carregamento
window.addEventListener('load', function() {
    // Remover qualquer tela de carregamento ou efeitos de fade-in
    document.body.classList.add('loaded');
});
