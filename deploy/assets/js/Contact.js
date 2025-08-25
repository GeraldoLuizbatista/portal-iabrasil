// Arquivo: assets/js/contact.js

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('feedback-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Não vamos prevenir o envio padrão, pois o Formspree precisa disso
      
      // Obter o botão de envio
      const submitButton = contactForm.querySelector('.submit-btn');
      const originalText = submitButton.textContent;
      
      // Desabilitar o botão e mudar o texto
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
      
      // Mostrar mensagem de sucesso quando o formulário retornar
      // Isso ocorrerá se a página for redirecionada de volta do Formspree
      if (window.location.search.includes('submitted=true')) {
        document.querySelector('.form-success').style.display = 'block';
        contactForm.reset();
      }
      
      // Armazenar que o formulário está sendo enviado
      localStorage.setItem('form_submitting', 'true');
    });
    
    // Verificar se estamos voltando após um envio
    if (window.location.search.includes('success') || localStorage.getItem('form_submitted') === 'true') {
      document.querySelector('.form-success').style.display = 'block';
      contactForm.reset();
      localStorage.setItem('form_submitted', 'true');
      // Limpar após alguns segundos
      setTimeout(() => {
        localStorage.removeItem('form_submitted');
      }, 5000);
    }
    
    // Limpar flag de envio se voltamos sem sucesso
    if (localStorage.getItem('form_submitting') === 'true' && !window.location.search.includes('success')) {
      localStorage.removeItem('form_submitting');
    }
  }
});
