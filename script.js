// ========== STATE ==========
let currentSection = 0;
const sections = [
    'loading-screen',
    'intro-screen',
    'memory-screen',
    'reasons-screen',
    'question-screen',
    'celebration-screen'
];
let noClickCount = 0;
let galleryIndex = 0;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    startLoadingSequence();
    setupNavigation();
    setupGallery();
    setupQuestionButtons();
});

// ========== FLOATING HEARTS BACKGROUND ==========
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['\u2764\uFE0F', '\uD83D\uDC9C', '\uD83D\uDC9B', '\uD83D\uDC95', '\uD83D\uDC96', '\uD83D\uDC97', '\uD83D\uDC98', '\u2763\uFE0F'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('span');
        heart.className = 'bg-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (12 + Math.random() * 20) + 'px';
        heart.style.animationDuration = (8 + Math.random() * 12) + 's';
        heart.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(heart);
    }
}

// ========== LOADING SEQUENCE ==========
function startLoadingSequence() {
    const messages = [
        { text: 'Downloading courage.exe...', percent: 12 },
        { text: 'Installing smooth-talk.dll...', percent: 28 },
        { text: 'Buffering rizz levels...', percent: 45 },
        { text: 'Rehearsing speech in mirror...', percent: 63 },
        { text: 'Final preparations... (wiping sweat)...', percent: 82 },
        { text: 'Ready! (I think)', percent: 100 }
    ];

    const msgEl = document.getElementById('loading-msg');
    const fillEl = document.getElementById('progress-fill');
    const percentEl = document.getElementById('loading-percent');
    let step = 0;

    function nextStep() {
        if (step < messages.length) {
            const msg = messages[step];
            msgEl.style.opacity = '0';
            setTimeout(() => {
                msgEl.textContent = msg.text;
                msgEl.style.opacity = '1';
                fillEl.style.width = msg.percent + '%';
                percentEl.textContent = msg.percent + '%';
                step++;
                if (step < messages.length) {
                    setTimeout(nextStep, 900);
                } else {
                    // Done loading - advance to intro
                    setTimeout(() => goToSection(1), 1200);
                }
            }, 200);
        }
    }

    setTimeout(nextStep, 800);
}

// ========== NAVIGATION ==========
function setupNavigation() {
    document.getElementById('btn-to-memories').addEventListener('click', () => goToSection(2));
    document.getElementById('btn-to-reasons').addEventListener('click', () => goToSection(3));
    document.getElementById('btn-to-question').addEventListener('click', () => goToSection(4));
}

function goToSection(index) {
    // Hide current
    const currentEl = document.getElementById(sections[currentSection]);
    currentEl.classList.remove('active');
    currentEl.style.display = 'none';

    // Show next
    currentSection = index;
    const nextEl = document.getElementById(sections[index]);
    nextEl.style.display = 'flex';

    // Force reflow for animation
    void nextEl.offsetWidth;
    nextEl.classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);

    // Trigger section-specific animations
    if (index === 3) animateReasons();
}

// ========== GALLERY ==========
function setupGallery() {
    const track = document.getElementById('gallery-track');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const dotsContainer = document.getElementById('gallery-dots');
    const polaroids = track.querySelectorAll('.polaroid');
    const totalSlides = polaroids.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => scrollToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function getSlideWidth() {
        if (!polaroids[0]) return 280;
        const style = window.getComputedStyle(polaroids[0]);
        const width = polaroids[0].offsetWidth;
        const gap = 20; // gap from CSS
        return width + gap;
    }

    function scrollToSlide(index) {
        galleryIndex = Math.max(0, Math.min(index, totalSlides - 1));
        const slideWidth = getSlideWidth();
        const viewport = track.parentElement;
        const viewportWidth = viewport.offsetWidth;
        const totalWidth = slideWidth * totalSlides - 20;
        // Center the current slide
        let offset = galleryIndex * slideWidth - (viewportWidth / 2) + (slideWidth / 2);
        offset = Math.max(0, Math.min(offset, Math.max(0, totalWidth - viewportWidth)));
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
        updateArrows();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === galleryIndex);
        });
    }

    function updateArrows() {
        prevBtn.disabled = galleryIndex === 0;
        nextBtn.disabled = galleryIndex === totalSlides - 1;
    }

    prevBtn.addEventListener('click', () => scrollToSlide(galleryIndex - 1));
    nextBtn.addEventListener('click', () => scrollToSlide(galleryIndex + 1));

    updateArrows();

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) scrollToSlide(galleryIndex + 1);
            else scrollToSlide(galleryIndex - 1);
        }
    }, { passive: true });

    // Recalculate on resize
    window.addEventListener('resize', () => scrollToSlide(galleryIndex));
}

// ========== REASONS ANIMATION ==========
function animateReasons() {
    const items = document.querySelectorAll('.reason-item');
    items.forEach((item, i) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 200 + (i * 250));
    });
}

// ========== QUESTION / YES-NO BUTTONS ==========
function setupQuestionButtons() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const responseEl = document.getElementById('no-response');
    const buttonsContainer = document.getElementById('answer-buttons');

    const noResponses = [
        { text: "Are you sure about that? \uD83E\uDD7A", action: 'nudge' },
        { text: "Hmm, that button seems to be malfunctioning...", action: 'shrink' },
        { text: "I don't think that's the right answer \uD83D\uDE05", action: 'move' },
        { text: "Technical difficulties... please try the other button \uD83D\uDE02", action: 'run' },
        { text: "'No' has left the chat \uD83D\uDC4B", action: 'disappear' }
    ];

    yesBtn.addEventListener('click', () => {
        handleYes();
    });

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleNo(noBtn, yesBtn, responseEl, buttonsContainer, noResponses);
    });

    // Also dodge on hover for desktop
    noBtn.addEventListener('mouseenter', () => {
        if (noClickCount >= 2) {
            dodgeButton(noBtn, buttonsContainer);
        }
    });
}

function handleNo(noBtn, yesBtn, responseEl, container, responses) {
    if (noClickCount >= responses.length) return;

    const response = responses[noClickCount];
    responseEl.textContent = response.text;
    responseEl.style.opacity = '0';
    setTimeout(() => { responseEl.style.opacity = '1'; }, 50);

    switch (response.action) {
        case 'nudge':
            noBtn.style.transform = 'translateX(20px)';
            noBtn.style.fontSize = '0.9em';
            yesBtn.classList.add('growing');
            break;
        case 'shrink':
            noBtn.style.transform = 'translateX(-30px) scale(0.7)';
            noBtn.style.fontSize = '0.8em';
            noBtn.textContent = 'No...?';
            break;
        case 'move':
            dodgeButton(noBtn, container);
            noBtn.style.fontSize = '0.7em';
            noBtn.textContent = 'N-no?';
            yesBtn.classList.remove('growing');
            yesBtn.classList.add('giant');
            break;
        case 'run':
            dodgeButton(noBtn, container);
            setTimeout(() => dodgeButton(noBtn, container), 300);
            setTimeout(() => dodgeButton(noBtn, container), 600);
            noBtn.style.fontSize = '0.6em';
            noBtn.style.opacity = '0.5';
            break;
        case 'disappear':
            noBtn.style.transition = 'all 0.5s ease';
            noBtn.style.transform = 'scale(0) rotate(180deg)';
            noBtn.style.opacity = '0';
            setTimeout(() => {
                noBtn.style.display = 'none';
            }, 500);
            yesBtn.classList.remove('giant');
            yesBtn.style.padding = '20px 80px';
            yesBtn.style.fontSize = '1.5em';
            yesBtn.textContent = 'YES! \u2764\uFE0F (only option)';
            break;
    }

    noClickCount++;
}

function dodgeButton(btn, container) {
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width / 2 - 60;
    const maxY = 40;
    const randX = (Math.random() - 0.5) * 2 * maxX;
    const randY = (Math.random() - 0.5) * 2 * maxY;
    btn.style.transition = 'all 0.3s ease';
    btn.style.transform = `translate(${randX}px, ${randY}px) scale(${0.8 - noClickCount * 0.1})`;
}

function handleYes() {
    goToSection(5);
    startCelebration();
}

// ========== CELEBRATION ==========
function startCelebration() {
    const titleEl = document.getElementById('celebration-title');
    const messageEl = document.getElementById('celebration-message');

    // Dramatic reveal
    titleEl.textContent = 'Processing...';

    setTimeout(() => {
        titleEl.textContent = 'Processing... \u2764\uFE0F';
    }, 600);

    setTimeout(() => {
        titleEl.textContent = 'SHE SAID YES!!!';
        titleEl.style.animation = 'celebrateBounce 0.6s ease-out';
        launchConfetti();
    }, 1500);

    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            messageEl.textContent = "Fantastic, not like you really had a choice mome \uD83D\uDE0F\nCongratulations on making a good decision";
            messageEl.style.whiteSpace = 'pre-line';
            messageEl.style.opacity = '1';
        }, 300);
    }, 2500);

    // Keep launching confetti
    setTimeout(() => launchConfetti(), 3000);
    setTimeout(() => launchConfetti(), 5000);
    setTimeout(() => launchHearts(), 2000);
    setTimeout(() => launchHearts(), 4000);

    // Show Saturday plans picker
    setTimeout(() => {
        const plansEl = document.getElementById('saturday-plans');
        plansEl.classList.add('visible');
        setupPlanButtons();
    }, 4500);
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FF1744', '#E91E63', '#FF6B6B', '#FFD700', '#FF4081', '#F50057', '#FF80AB', '#7C4DFF', '#FF6D00'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (5 + Math.random() * 10) + 'px';
        piece.style.height = (5 + Math.random() * 10) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        container.appendChild(piece);

        // Clean up
        setTimeout(() => piece.remove(), 6000);
    }
}

// ========== SATURDAY PLANS ==========
function setupPlanButtons() {
    const dinnerBtn = document.getElementById('plan-dinner');
    const picnicBtn = document.getElementById('plan-picnic');
    const responseEl = document.getElementById('plan-response');

    dinnerBtn.addEventListener('click', () => {
        dinnerBtn.classList.add('selected');
        picnicBtn.classList.remove('selected');
        responseEl.textContent = "Dinner it is! Time to get fancy \u2728\uD83D\uDE0D";
        responseEl.classList.add('visible');
        launchConfetti();
    });

    picnicBtn.addEventListener('click', () => {
        picnicBtn.classList.add('selected');
        dinnerBtn.classList.remove('selected');
        responseEl.textContent = "Blankets + snacks + movies = perfection \uD83E\uDD70\uD83C\uDF7F";
        responseEl.classList.add('visible');
        launchConfetti();
    });
}

function launchHearts() {
    const container = document.getElementById('confetti-container');
    const hearts = ['\u2764\uFE0F', '\uD83D\uDC95', '\uD83D\uDC96', '\uD83D\uDC97', '\uD83E\uDE77'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('span');
        heart.className = 'confetti-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (14 + Math.random() * 24) + 'px';
        heart.style.animationDuration = (3 + Math.random() * 4) + 's';
        heart.style.animationDelay = (Math.random() * 1.5) + 's';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 8000);
    }
}
