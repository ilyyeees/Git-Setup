// Progress tracking
let completedSteps = 0;
const totalSteps = 5;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  initializeProgressTracking();
  initializeAnimations();
  initializeFloatingProgress();
  loadProgress();
});

// Progress tracking functionality
function initializeProgressTracking() {
  const checkboxes = document.querySelectorAll('.step-checkbox');

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
      const stepCard = this.closest('.step-card');
      const stepNumber = index + 1;

      if (this.checked) {
        stepCard.classList.add('completed');
        completedSteps++;

        // Add completion animation
        setTimeout(() => {
          createConfetti(stepCard.querySelector('.step-number'));
        }, 100);

        // Save progress
        saveProgress();

        // Auto-scroll to next step
        scrollToNextStep(stepNumber);
      } else {
        stepCard.classList.remove('completed');
        completedSteps--;
        saveProgress();
      }

      updateProgress();
      updateFloatingProgress();
      checkCompletion();
    });
  });
}

// Update progress bar and text
function updateProgress() {
  const progressFill = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  progressFill.style.width = percentage + '%';
  progressText.textContent = percentage + '% Complete';

  // Add pulse animation when progress increases
  progressFill.classList.add('pulse');
  setTimeout(() => {
    progressFill.classList.remove('pulse');
  }, 600);
}

// Update floating progress indicator
function updateFloatingProgress() {
  const floatingProgress = document.getElementById('floatingProgress');
  const progressRing = document.querySelector('.progress-ring-circle');
  const progressText = document.querySelector('.floating-progress-text');

  const percentage = (completedSteps / totalSteps) * 100;
  const circumference = 163.36; // 2 * π * 26
  const offset = circumference - (percentage / 100) * circumference;

  progressRing.style.strokeDashoffset = offset;
  progressText.textContent = `${completedSteps}/${totalSteps}`;

  // Show floating progress after first step
  if (completedSteps > 0) {
    floatingProgress.classList.add('visible');
  } else {
    floatingProgress.classList.remove('visible');
  }
}

// Initialize floating progress functionality
function initializeFloatingProgress() {
  const floatingProgress = document.getElementById('floatingProgress');

  floatingProgress.addEventListener('click', function () {
    // Scroll to current step or completion
    if (completedSteps === totalSteps) {
      document.getElementById('completionSection').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    } else {
      const nextStep = document.querySelector(
        `[data-step="${completedSteps + 1}"]`
      );
      if (nextStep) {
        nextStep.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  });
}

// Auto-scroll to next step
function scrollToNextStep(completedStep) {
  setTimeout(() => {
    if (completedStep < totalSteps) {
      const nextStep = document.querySelector(
        `[data-step="${completedStep + 1}"]`
      );
      if (nextStep) {
        nextStep.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, 1000);
}

// Check if all steps are completed
function checkCompletion() {
  const completionSection = document.getElementById('completionSection');

  if (completedSteps === totalSteps) {
    setTimeout(() => {
      completionSection.style.display = 'block';
      completionSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Create celebration effect
      createCelebration();
    }, 1500);
  } else {
    completionSection.style.display = 'none';
  }
}

// Copy code functionality
function copyCode(button) {
  const codeBlock = button.closest('.code-block');
  const code = codeBlock.querySelector('code').textContent;

  navigator.clipboard
    .writeText(code)
    .then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.background = 'var(--success-color)';
      button.style.color = 'white';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.color = '';
      }, 2000);
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for step cards
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document.querySelectorAll('.step-card').forEach((card) => {
    observer.observe(card);
  });
}

// Create confetti effect
function createConfetti(element) {
  const colors = ['#0969da', '#1a7f37', '#bf8700', '#cf222e', '#8b5cf6'];
  const confettiCount = 20;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 1000;
            border-radius: 50%;
        `;

    const rect = element.getBoundingClientRect();
    confetti.style.left = rect.left + rect.width / 2 + 'px';
    confetti.style.top = rect.top + rect.height / 2 + 'px';

    document.body.appendChild(confetti);

    // Animate confetti
    const animation = confetti.animate(
      [
        {
          transform: 'translate(0, 0) rotate(0deg)',
          opacity: 1,
        },
        {
          transform: `translate(${(Math.random() - 0.5) * 200}px, ${
            Math.random() * -100 - 50
          }px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    );

    animation.onfinish = () => confetti.remove();
  }
}

// Create celebration effect
function createCelebration() {
  const celebrationCount = 50;
  const colors = [
    '#0969da',
    '#1a7f37',
    '#bf8700',
    '#cf222e',
    '#8b5cf6',
    '#d73a49',
  ];

  for (let i = 0; i < celebrationCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${
                  colors[Math.floor(Math.random() * colors.length)]
                };
                pointer-events: none;
                z-index: 10000;
                border-radius: 50%;
                left: ${Math.random() * window.innerWidth}px;
                top: -10px;
            `;

      document.body.appendChild(confetti);

      const animation = confetti.animate(
        [
          {
            transform: 'translateY(0) rotate(0deg)',
            opacity: 1,
          },
          {
            transform: `translateY(${window.innerHeight + 100}px) rotate(${
              Math.random() * 360
            }deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 3000 + Math.random() * 2000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
      );

      animation.onfinish = () => confetti.remove();
    }, Math.random() * 3000);
  }
}

// Save progress to localStorage
function saveProgress() {
  const checkboxes = document.querySelectorAll('.step-checkbox');
  const progress = Array.from(checkboxes).map((cb) => cb.checked);
  localStorage.setItem('gitSetupProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('gitSetupProgress');
  if (saved) {
    const progress = JSON.parse(saved);
    const checkboxes = document.querySelectorAll('.step-checkbox');

    progress.forEach((checked, index) => {
      if (checkboxes[index] && checked) {
        checkboxes[index].checked = true;
        checkboxes[index].closest('.step-card').classList.add('completed');
        completedSteps++;
      }
    });

    updateProgress();
    updateFloatingProgress();
    checkCompletion();
  }
}

// Reset progress
function resetProgress() {
  if (
    confirm(
      'Are you sure you want to reset your progress? This will uncheck all completed steps.'
    )
  ) {
    const checkboxes = document.querySelectorAll('.step-checkbox');
    const stepCards = document.querySelectorAll('.step-card');

    checkboxes.forEach((cb) => (cb.checked = false));
    stepCards.forEach((card) => card.classList.remove('completed'));

    completedSteps = 0;
    updateProgress();
    updateFloatingProgress();

    document.getElementById('completionSection').style.display = 'none';
    localStorage.removeItem('gitSetupProgress');

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function (e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
});

// Add pulse animation class to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .pulse {
        animation: progress-pulse 0.6s ease-out !important;
    }

    @keyframes progress-pulse {
        0% { transform: scaleY(1); }
        50% { transform: scaleY(1.2); }
        100% { transform: scaleY(1); }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
  // Press 'r' to reset progress (when Ctrl/Cmd is held)
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    resetProgress();
  }

  // Press 'p' to print
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    window.print();
  }
});

// Handle scroll for header shadow
window.addEventListener('scroll', function () {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.style.boxShadow = 'var(--shadow-medium)';
  } else {
    header.style.boxShadow = 'var(--shadow-small)';
  }
});

// Add tooltips to step numbers
document.querySelectorAll('.step-number').forEach((stepNumber, index) => {
  stepNumber.title = `Step ${index + 1}`;
});

// Progressive enhancement for reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', 'none');
}
