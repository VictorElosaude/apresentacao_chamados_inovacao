document.addEventListener('DOMContentLoaded', function () {
    // Animação de scroll para seções
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Parallax suave para o hero
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroImg = document.querySelector('.hero-img');

        if (hero && heroImg) {
            const rate = scrolled * -0.5;
            heroImg.style.transform = `translateY(${rate}px)`;
        }
    });

    // Animação dos cards de features
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Botão do Calendly (popup modal)
    const scheduleBtn = document.getElementById('scheduleButton');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function () {
            if (window.Calendly) {
                Calendly.initPopupWidget({
                    url: 'https://calendly.com/victorelosaude/30min'
                });
            } else {
                console.error('Calendly widget não foi carregado. Verifique se o script widget.js está incluído.');
                alert('Erro ao carregar o agendamento. Por favor, tente novamente mais tarde ou entre em contato diretamente.');
            }
        });
    }

    // Redimensionamento fluido do vídeo no hero (qualquer borda ou canto)
    const imageContent = document.querySelector('.hero .image-content');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    if (imageContent) {
        imageContent.addEventListener('mousedown', function (e) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = imageContent.offsetWidth;
            startHeight = imageContent.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (isResizing) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const newWidth = startWidth + dx;
                const newHeight = startHeight + dy;
                const maxWidth = window.innerWidth - imageContent.getBoundingClientRect().left - 20;
                const maxHeight = window.innerHeight - imageContent.getBoundingClientRect().top - 20;

                imageContent.style.width = `${Math.max(50, Math.min(newWidth, maxWidth))}px`;
                imageContent.style.height = `${Math.max(50, Math.min(newHeight, maxHeight))}px`;
                imageContent.style.flexBasis = `${Math.max(50, Math.min(newWidth, maxWidth))}px`;
            }
        });

        document.addEventListener('mouseup', function () {
            isResizing = false;
        });

        imageContent.addEventListener('selectstart', function (e) {
            if (isResizing) e.preventDefault();
        });
    }

    // ===================================================================
    //  INÍCIO DA LÓGICA DO BOTÃO DE CONTROLE DE SOM DO VÍDEO
    // ===================================================================
    const video = document.getElementById('hero-video');
    const muteBtn = document.getElementById('btn-mute');

    // Verifica se os elementos do vídeo e do botão realmente existem na página
    if (video && muteBtn) {
        const iconMuted = muteBtn.querySelector('.icon-muted');
        const iconUnmuted = muteBtn.querySelector('.icon-unmuted');

        muteBtn.addEventListener('click', (event) => {
            // Impede que o clique no botão ative o evento de 'arrastar' do container pai
            event.stopPropagation(); 
            
            if (video.muted) {
                video.muted = false;
                iconMuted.style.display = 'none';
                iconUnmuted.style.display = 'block';
            } else {
                video.muted = true;
                iconMuted.style.display = 'block';
                iconUnmuted.style.display = 'none';
            }
        });
    }
    // ===================================================================
    //  FIM DA LÓGICA DO BOTÃO
    // ===================================================================

    // Controle da animação silverTextShine com intervalo de 2 minutos
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        function startSilverTextShine() {
            heroTitle.style.animation = 'none'; // Reseta a animação
            heroTitle.offsetHeight; // Força reflow
            heroTitle.style.animation = 'fadeInUp 1s ease-out, silverTextShine 6s linear';
        }

        // Inicia a animação após 2 segundos
        setTimeout(startSilverTextShine, 2000);

        // Repete a animação a cada 2 minutos (120000 ms) após o primeiro início
        setInterval(() => {
            startSilverTextShine();
        }, 120000);
    }
});

// --- Funções Globais (fora do DOMContentLoaded) ---

// Função para o botão de contato
function openContact() {
    alert('Entre em contato conosco através dos canais internos da instituição ou envie um e-mail para nossa equipe de inovação!');
}

// Efeito de typing para o título (opcional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Adicionar classe de animação CSS
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s ease forwards;
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Efeito de hover nos cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Efeito de partículas no background (opcional)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(particleStyle);

createParticles();

// ===================================================================
// VARIÁVEL GLOBAL PARA CONTROLAR O ESTADO DO COUNTDOWN
// ===================================================================
let countdownExpired = false;

// ===================================================================
// FUNÇÃO MODIFICADA PARA ABRIR O GOOGLE FORMS OU O MODAL
// ===================================================================
function openGoogleForm() {
    // Verifica se o countdown expirou
    if (countdownExpired) {
        // Se expirou, abre o modal
        const modal = document.getElementById('timeExpiredModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    } else {
        // Se ainda está ativo, abre o Google Forms
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSfbmuLVr-EKEyQzf6hNMQ_Uc0qFrnGmvDBjPB-zvgDMuVI7NQ/viewform', '_blank');
    }
}

// ===================================================================
// LÓGICA MODIFICADA DO CONTADOR DE TEMPO
// ===================================================================
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    const ctaButton = document.querySelector('.cta-button');
    const modal = document.getElementById('timeExpiredModal');
    const nextClassBtn = document.getElementById('nextClassBtn');
    
    // Defina a data alvo para o contador (ex: 31 de dezembro de 2025, 23:59:59)
    const targetDate = new Date('August 12, 2025 23:59:59').getTime();

    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownElement) {
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        if (distance < 0) {
            clearInterval(updateCountdown);

            // ===================================================================
            // MARCA QUE O COUNTDOWN EXPIROU
            // ===================================================================
            countdownExpired = true;

            if (countdownElement) {
                countdownElement.innerHTML = "Inscrições encerradas!";
            }

            if (ctaButton) {
                ctaButton.textContent = "Inscrições Encerradas";
                // NOTA: O botão mantém a mesma função onclick="openGoogleForm()"
                // mas agora a função openGoogleForm() verifica o estado do countdown
            }
        }
    }, 1000);
    
    // Adicionar evento ao botão do modal
    if (nextClassBtn) {
        nextClassBtn.addEventListener('click', function() {
            // Aqui você pode adicionar o embed do forms ou redirecionar
            // Por enquanto, vamos fechar o modal e mostrar uma mensagem
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Placeholder para o embed do forms - você pode substituir por:
            // window.open('URL_DO_FORMS', '_blank');
            // ou adicionar o embed diretamente
            alert('Em breve você receberá informações sobre a próxima turma!');
            
            // Exemplo de como você poderia abrir um forms:
            // window.open('https://docs.google.com/forms/d/e/SEU_FORM_ID/viewform', '_blank');
        });
    }
    
    // Fechar modal clicando fora dele
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Iniciar o contador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', startCountdown);

// ===================================================================
// FUNÇÃO PARA TESTAR O MODAL (SIMULAR TEMPO ESGOTADO)
// ===================================================================
function testTimeExpired() {
    const countdownElement = document.getElementById('countdown');
    const ctaButton = document.querySelector('.cta-button');
    
    // Marca que o countdown expirou
    countdownExpired = true;
    
    // Simular tempo esgotado
    if (countdownElement) {
        countdownElement.innerHTML = "Inscrições encerradas!";
    }
    
    // Atualizar o texto do botão
    if (ctaButton) {
        ctaButton.textContent = "Inscrições Encerradas";
    }
    
    // Agora quando clicar no botão, ele abrirá o modal automaticamente
    // porque a função openGoogleForm() verifica o estado countdownExpired
}

// Para testar, você pode chamar testTimeExpired() no console do navegador
// ou adicionar um botão temporário para teste

