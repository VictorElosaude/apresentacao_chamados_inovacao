document.addEventListener('DOMContentLoaded', function () {
    // === LÓGICA DE VAGAS E CRONÔMETRO ===
    const ctaButton = document.getElementById('inscrever-btn');
    const vagasCountElement = document.getElementById('vagas-count');
    const vagasTextElement = document.getElementById('vagas-disponiveis-text');
    const countdownElement = document.getElementById('countdown');
    const inscricaoModal = document.getElementById('inscricaoModal');
    const inscricaoForm = document.getElementById('inscricaoForm');
    const timeExpiredModal = document.getElementById('timeExpiredModal');
    const nextClassBtn = document.getElementById('nextClassBtn');
<<<<<<< HEAD
    const cancelarBtn = document.getElementById('cancelarBtn');
=======
    
    // Defina a data alvo para o contador (ex: 31 de dezembro de 2025, 23:59:59)
    const targetDate = new Date('August 25, 2025 23:59:59').getTime();
>>>>>>> 96df202f0c9caec37086e494ce66a859e662ae89

    let vagasDisponiveis = null;
    let tempoRestante = null;

    // Função para buscar o número de vagas no backend
    async function fetchVagas() {
        console.log("Tentando buscar o número de vagas...");
        try {
            const response = await fetch('/vagas.json');
            if (!response.ok) {
                console.error("Erro na resposta da rede:", response.status, response.statusText);
                throw new Error('Falha ao buscar as vagas.');
            }
            const data = await response.json();
            vagasDisponiveis = data.vagas_disponiveis;
            console.log("Vagas disponíveis obtidas:", vagasDisponiveis);
            updateUI();
        } catch (error) {
            console.error('Erro ao buscar as vagas:', error);
            if (vagasTextElement) {
                vagasTextElement.innerHTML = 'Vagas para a próxima turma: <span style="color: red;">Erro ao carregar as vagas. Tente novamente mais tarde.</span>';
            }
            if (ctaButton) {
                ctaButton.textContent = 'Erro ao Carregar';
                ctaButton.disabled = true;
            }
        }
    }

    // Lógica do cronômetro
    function startCountdown() {
        console.log("Iniciando cronômetro...");
        const targetDate = new Date('August 22, 2025 23:59:59').getTime(); // Altere esta data
        const updateCountdown = setInterval(function () {
            const now = new Date().getTime();
            tempoRestante = targetDate - now;

            const days = Math.floor(tempoRestante / (1000 * 60 * 60 * 24));
            const hours = Math.floor((tempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((tempoRestante % (1000 * 60)) / 1000);

            if (countdownElement) {
                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }

            if (tempoRestante < 0) {
                clearInterval(updateCountdown);
                tempoRestante = 0;
                console.log("Tempo esgotado.");
                updateUI();
            }
        }, 1000);
    }

    // Função central que decide o estado da interface
    function updateUI() {
        console.log("Atualizando a UI. Vagas:", vagasDisponiveis, " | Tempo Restante:", tempoRestante);
        
        // Se ainda não temos a informação das vagas, não faz nada
        if (vagasDisponiveis === null) return;

        const canInscrever = vagasDisponiveis > 0 && (tempoRestante === null || tempoRestante > 0);

        if (canInscrever) {
            // Inscrições abertas: mostra a contagem de vagas e o botão
            if (vagasTextElement) {
                vagasTextElement.innerHTML = `Vagas para a próxima turma: <span id="vagas-count">${vagasDisponiveis}</span>`;
                vagasTextElement.classList.add('vagas-yellow');
                vagasTextElement.classList.remove('vagas-red');
            }
            if (ctaButton) {
                ctaButton.textContent = "Fazer parte da próxima turma";
                ctaButton.disabled = false;
                ctaButton.style.display = 'block';
            }
            if (countdownElement) {
                countdownElement.parentNode.style.display = 'block';
            }
        } else {
            // Inscrições fechadas (por vagas ou tempo)
            if (vagasDisponiveis === 0) {
                if (vagasTextElement) {
                    vagasTextElement.innerHTML = 'Todas as vagas foram preenchidas. Em breve, lançaremos uma nova turma.';
                    vagasTextElement.classList.add('vagas-red');
                    vagasTextElement.classList.remove('vagas-yellow');
                }
                console.log("Inscrições encerradas: Vagas esgotadas.");
            } else if (tempoRestante <= 0) {
                if (countdownElement) {
                    countdownElement.innerHTML = "Inscrições encerradas!";
                }
                console.log("Inscrições encerradas: Tempo esgotado.");
            }

            if (ctaButton) {
                ctaButton.textContent = "Inscrições Encerradas";
                ctaButton.disabled = true;
            }
            if (countdownElement) {
                countdownElement.parentNode.style.display = 'block';
            }
        }
    }

    // Lógica para abrir o modal
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            if (vagasDisponiveis > 0 && (tempoRestante === null || tempoRestante > 0)) {
                console.log("Botão clicado. Abrindo modal de inscrição.");
                if (inscricaoModal) {
                    inscricaoModal.style.display = 'flex';
                }
            } else {
                console.log("Botão clicado. Inscrições fechadas. Abrindo modal de tempo esgotado.");
                if (timeExpiredModal) {
                    timeExpiredModal.style.display = 'flex';
                }
            }
        });
    }
    
    // Lógica para fechar o modal ao clicar fora
    if (inscricaoModal) {
        inscricaoModal.addEventListener('click', (e) => {
            if (e.target === inscricaoModal) {
                inscricaoModal.style.display = 'none';
                console.log("Modal de inscrição fechado.");
            }
        });
    }

    // Lógica para fechar o modal de tempo esgotado ao clicar fora
    if (timeExpiredModal) {
        timeExpiredModal.addEventListener('click', (e) => {
            if (e.target === timeExpiredModal) {
                timeExpiredModal.style.display = 'none';
                console.log("Modal de tempo esgotado fechado.");
            }
        });
    }

    // Lógica para o botão "Quero participar da próxima turma"
    if (nextClassBtn) {
        nextClassBtn.addEventListener('click', () => {
            if (timeExpiredModal) {
                timeExpiredModal.style.display = 'none';
            }
            console.log("Botão 'Próxima Turma' clicado.");
            // Você pode adicionar um link para um formulário de lista de espera aqui
            alert('Em breve você receberá informações sobre a próxima turma!');
        });
    }

     if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            if (inscricaoModal) {
                inscricaoModal.style.display = 'none';
                console.log("Modal de inscrição fechado pelo botão Cancelar.");
            }
        });
    }
    
    // Lógica para envio do formulário
    if (inscricaoForm) {
        inscricaoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log("1. Formulário de inscrição submetido. Coletando dados...");

            const formData = {
                nome: document.getElementById('nome').value,
                setor: document.getElementById('setor').value,
                email: document.getElementById('email').value
            };
            
            console.log("2. Dados do formulário coletados:", formData);
            try {
                console.log("3. Tentando enviar os dados para o servidor no endereço '/inscrever'...");
                const response = await fetch('/inscrever', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                console.log("4. Resposta do servidor recebida:", response.status, response.statusText);

                if (!response.ok) {
                    console.error("Erro na resposta do backend:", response.status, response.statusText);
                    throw new Error('Falha na inscrição. Tente novamente.');
                }
                
                
                alert('Sua inscrição foi confirmada!');
                inscricaoModal.style.display = 'none';
                inscricaoForm.reset();
                console.log("Inscrição bem-sucedida. Buscando vagas novamente...");
                fetchVagas(); // Atualiza a contagem de vagas
            } catch (error) {
                console.error('Erro de inscrição:', error);
                alert('Houve um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.');
            }
        });
    }

    // Inicia a verificação de vagas e tempo
    fetchVagas();
    startCountdown();

});