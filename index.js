// Função para exibir notificações (toast)
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  toastMessage.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Função para aplicar máscara de telefone enquanto digita
function mascaraTelefone(event) {
  const input = event.target;
  let value = input.value.replace(/\D/g, '');
  
  // Formatação para números 0800
  if (value.substring(0, 4) === '0800') {
    if (value.length > 4) {
      value = value.substring(0, 4) + '-' + value.substring(4, 7) + (value.length > 7 ? '-' + value.substring(7, 11) : '');
    }
  } 
  // Formatação para números com DDD
  else if (value.length > 2) {
    value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    if (value.length > 9) {
      value = value.substring(0, 10) + '-' + value.substring(10, 15);
    }
  }
  
  input.value = value;
}

// Função para gerar a assinatura
function gerarAssinatura() {
  const nome = document.getElementById("nome").value.trim();
  const cargo = document.getElementById("cargo").value.trim();
  let telefone = document.getElementById("telefone").value.trim();
  
  // Validação dos campos obrigatórios
  if (!nome || !cargo || !telefone) {
    showToast("Por favor, preencha todos os campos obrigatórios");
    return;
  }

  // Limpa o telefone para validação
  const telefoneLimpo = telefone.replace(/\D/g, '');
  // Validação do formato do telefone
  if (telefoneLimpo.substring(0, 4) === '0800') {
    if (telefoneLimpo.length !== 10) {
      showToast("Número 0800 deve ter 10 dígitos");
      return;
    }
  } else if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    showToast("Telefone deve ter 10 ou 11 dígitos (incluindo DDD)");
    return;
  }

  // Formatação final do telefone
  let telefoneFormatado = '';
  if (telefoneLimpo.substring(0, 4) === '0800') {
    telefoneFormatado = `${telefoneLimpo.substring(0, 4)}-${telefoneLimpo.substring(4, 7)}-${telefoneLimpo.substring(7)}`;
  } else if (telefoneLimpo.length === 11) {
    telefoneFormatado = `(${telefoneLimpo.substring(0, 2)}) ${telefoneLimpo.substring(2, 7)}-${telefoneLimpo.substring(7)}`;
  } else if (telefoneLimpo.length === 10) {
    telefoneFormatado = `(${telefoneLimpo.substring(0, 2)}) ${telefoneLimpo.substring(2, 6)}-${telefoneLimpo.substring(6)}`;
  }

  // Atualiza a exibição da assinatura
  document.getElementById("nomeDisplay").innerText = nome;
  document.getElementById("cargoDisplay").innerText = cargo;
  document.getElementById("telefoneDisplay").innerText = telefoneFormatado;
  
  // Mostra a assinatura
  document.getElementById("assinatura").style.display = 'block';
  
  showToast("Assinatura gerada com sucesso!");
}

// Função para baixar a assinatura como imagem
function baixarImagem() {
  const nomeDisplay = document.getElementById("nomeDisplay").innerText;
  
  // Verifica se a assinatura foi gerada
  if (!nomeDisplay || nomeDisplay === "Seu Nome Completo") {
    showToast("Por favor, preencha os dados e clique em 'Gerar Assinatura'");
    return;
  }

  // Verifica se a assinatura está visível
  const assinatura = document.querySelector("#assinatura");
  if (assinatura.style.display === 'none') {
    showToast("Por favor, gere a assinatura primeiro");
    return;
  }

  // Configurações para gerar a imagem
  const options = {
    useCORS: true,
    backgroundColor: null,
    scale: 2,
    logging: true,
    allowTaint: true
  };

  // Gera e faz download da imagem
  html2canvas(assinatura, options)
    .then((canvas) => {
      const link = document.createElement("a");
      link.download = "assinatura-mon-seguros.png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error("Erro ao gerar imagem:", error);
      showToast("Ocorreu um erro ao gerar a imagem");
    });
}

// Função para limpar o formulário
function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("cargo").value = "";
  document.getElementById("telefone").value = "";
  
  document.getElementById("nomeDisplay").innerText = "Seu Nome Completo";
  document.getElementById("cargoDisplay").innerText = "Seu Cargo";
  document.getElementById("telefoneDisplay").innerText = "(00) 0000-0000";
  
  document.getElementById("assinatura").style.display = "none";
  
  showToast("Formulário limpo com sucesso");
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona máscara ao campo de telefone
  document.getElementById('telefone').addEventListener('input', mascaraTelefone);
  
  // Botão Gerar Assinatura
  document.getElementById('btnGerar').addEventListener('click', gerarAssinatura);
  
  // Botão Baixar Imagem
  document.getElementById('btnBaixar').addEventListener('click', baixarImagem);
  
  // Botão Limpar
  document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
});