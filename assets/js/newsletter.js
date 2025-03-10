// Arquivo: assets/js/newsletter.js

document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    // Verificar se o usuário já se inscreveu (baseado no localStorage)
    if (localStorage.getItem('newsletter_subscribed') === 'true') {
      showNewsletterSuccess();
    }
    
    newsletterForm.addEventListener('submit', function(e) {
      // Não prevenir o envio padrão para permitir que o MailChimp processe
      
      // Marcar como inscrito no localStorage
      localStorage.setItem('newsletter_subscribed', 'true');
      
      // Mostrar mensagem de sucesso após breve atraso
      setTimeout(() => {
        showNewsletterSuccess();
      }, 1000);
      
      // Mostrar toast de agradecimento
      showToast('Obrigado por assinar nossa newsletter!');
    });
  }
  
  function showNewsletterSuccess() {
    const successMessage = document.querySelector('.newsletter-success');
    const form = document.getElementById('newsletter-form');
    
    if (successMessage && form) {
      form.querySelector('input[type="email"]').style.display = 'none';
      form.querySelector('button[type="submit"]').style.display = 'none';
      successMessage.style.display = 'block';
    }
  }
  
  function showToast(message) {
    // Verificar se a função já existe (pode ter sido definida em main.js)
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }
    
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
});
