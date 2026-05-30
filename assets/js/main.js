/**
 * Main Controller for Electric Vehicle Awareness Website (Ola & Tesla Redesign)
 * Handles capsule nav scrolls, shared layouts injection, theme saves, animations, and counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Add entry animation class to body
  document.body.classList.add('page-fade');

  // 1. Initialize Dark/Light Mode Theme State
  initTheme();

  // 2. Inject Shared Header (Navbar) and Footer
  injectHeader();
  injectFooter();

  // 3. Highlight Current Navigation Item
  highlightActiveLink();

  // 4. Bind Authentication Events (Dynamic nav buttons like Logout)
  setupAuthNav();

  // 5. Scroll Animations (Intersection Observer for Reveal)
  initScrollAnimations();

  // 6. Interactive Counter Animations (Intersection Observer)
  initCounterAnimations();

  // 7. Scroll Capsule Nav Effect
  initScrollCapsule();
});

/* ==========================================
   1. Theme Configuration (Dark / Light Mode)
   ========================================== */
function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Update toggle button icon if it exists
  const icon = document.querySelector('#theme-toggle-btn i');
  if (icon) {
    icon.className = isDark ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-primary';
  }
}

/* ==========================================
   2. Shared Components Injection (Header & Footer)
   ========================================== */
function injectHeader() {
  const headerContainer = document.getElementById('main-header');
  if (!headerContainer) return;

  const path = window.location.pathname;
  const isSubFolder = path.includes('/pages/') || path.includes('/auth/');
  const rootPrefix = isSubFolder ? '../' : './';

  headerContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg fixed-top glass-nav py-3" id="navbar-capsule">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center fw-bold fs-4 text-glow-green" href="${rootPrefix}index.html" style="font-family: var(--font-heading); color: var(--color-green);">
          <i class="bi bi-lightning-charge-fill me-2 rotate-slow" style="color: var(--color-cyan);"></i>
          <span>Eco<span style="color: var(--text-primary);">Volt</span></span>
        </a>
        
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list fs-2 text-primary" style="color: var(--text-primary) !important;"></i>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto text-center gap-1 my-3 my-lg-0">
            <li class="nav-item">
              <a class="nav-link px-3 py-2 fw-semibold nav-link-pill" href="${rootPrefix}index.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3 py-2 fw-semibold nav-link-pill" href="${rootPrefix}info.html">EV Info</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3 py-2 fw-semibold nav-link-pill" href="${rootPrefix}policies.html">Policies</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3 py-2 fw-semibold nav-link-pill" href="${rootPrefix}models.html">EV Models</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3 py-2 fw-semibold nav-link-pill" href="${rootPrefix}resources.html">Help & Support</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3 py-2 fw-semibold nav-link-pill" href="${rootPrefix}contact.html">Contact Us</a>
            </li>
          </ul>
          
          <div class="d-flex align-items-center justify-content-center gap-3">
            <!-- Theme Toggle Button -->
            <button onclick="toggleTheme()" class="btn btn-glass p-2 d-flex align-items-center justify-content-center shadow-sm" id="theme-toggle-btn" style="width: 42px; height: 42px; border-radius: 50%;" aria-label="Toggle dark mode">
              <i class="${document.documentElement.classList.contains('dark') ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-primary'}"></i>
            </button>
            
            <!-- Auth Links -->
            <div id="auth-buttons-container" class="d-flex gap-2">
              <!-- Dynamically populated by setupAuthNav() -->
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

function injectFooter() {
  const footerContainer = document.getElementById('main-footer');
  if (!footerContainer) return;

  const path = window.location.pathname;
  const isSubFolder = path.includes('/pages/') || path.includes('/auth/');
  const rootPrefix = isSubFolder ? '../' : './';

  footerContainer.innerHTML = `
    <footer class="border-top" style="background-color: var(--bg-secondary); border-color: var(--border-color) !important; padding-top: 5rem; padding-bottom: 2.5rem; transition: var(--transition-smooth);">
      <div class="container">
        <div class="row g-4 justify-content-between mb-5">
          <!-- Col 1: Brand & Logo -->
          <div class="col-lg-4 col-md-6">
            <a class="navbar-brand d-flex align-items-center fw-bold fs-4 mb-3 text-glow-green" href="${rootPrefix}index.html" style="font-family: var(--font-heading); color: var(--color-green);">
              <i class="bi bi-lightning-charge-fill me-2 rotate-slow" style="color: var(--color-cyan);"></i>
              <span>Eco<span style="color: var(--text-primary);">Volt</span></span>
            </a>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">
              Empowering communities with clean interactive knowledge and resource calculators to drive adoption of Electric Vehicles globally.
            </p>
            <div class="d-flex gap-3 mt-4">
              <a href="#" class="btn btn-glass p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px; border-radius: 50%;" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
              <a href="#" class="btn btn-glass p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px; border-radius: 50%;" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="btn btn-glass p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px; border-radius: 50%;" aria-label="Youtube"><i class="bi bi-youtube"></i></a>
              <a href="#" class="btn btn-glass p-2 d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px; border-radius: 50%;" aria-label="GitHub"><i class="bi bi-github"></i></a>
            </div>
          </div>
          
          <!-- Col 2: Navigation Links -->
          <div class="col-lg-2 col-md-6">
            <h5 class="fw-bold mb-3" style="font-family: var(--font-heading); font-size: 1rem;">Explore</h5>
            <ul class="list-unstyled d-flex flex-column gap-2" style="font-size: 0.9rem;">
              <li><a href="${rootPrefix}index.html" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">Home</a></li>
              <li><a href="${rootPrefix}info.html" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">EV Information</a></li>
              <li><a href="${rootPrefix}policies.html" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">Incentives & Policies</a></li>
              <li><a href="${rootPrefix}models.html" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">Electric Car Catalog</a></li>
            </ul>
          </div>
          
          <!-- Col 3: Support -->
          <div class="col-lg-2 col-md-6">
            <h5 class="fw-bold mb-3" style="font-family: var(--font-heading); font-size: 1rem;">Support</h5>
            <ul class="list-unstyled d-flex flex-column gap-2" style="font-size: 0.9rem;">
              <li><a href="${rootPrefix}resources.html" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">Help & Support</a></li>
              <li><a href="${rootPrefix}resources.html#buying-guide" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">EV Buying Guide</a></li>
              <li><a href="${rootPrefix}contact.html" class="text-decoration-none" style="color: var(--text-secondary); transition: var(--transition-smooth);">Contact Support</a></li>
            </ul>
          </div>

          <!-- Col 4: Newsletter -->
          <div class="col-lg-3 col-md-6">
            <h5 class="fw-bold mb-3" style="font-family: var(--font-heading); font-size: 1rem;">Newsletter</h5>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              Subscribe to get the latest EV updates and Ola/Tesla release announcements.
            </p>
            <form onsubmit="handleGlobalNewsletter(event)" class="d-flex gap-2">
              <input type="email" class="form-control shadow-none calc-input flex-grow-1" placeholder="Your Email" required style="font-size: 0.85rem; border-radius: 0.75rem;">
              <button class="btn btn-glow-green px-3 d-flex align-items-center justify-content-center" type="submit" aria-label="Subscribe" style="border-radius: 0.75rem;">
                <i class="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>

        <hr style="border-color: var(--border-color); margin: 2rem 0;">

        <!-- Copyright -->
        <div class="row align-items-center justify-content-between text-center text-md-start">
          <div class="col-md-6 mb-2 mb-md-0">
            <p class="mb-0" style="color: var(--text-muted); font-size: 0.85rem;">
              &copy; 2026 EcoVolt Inc. Inspired by Ola & Tesla designs.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="d-flex justify-content-center justify-content-md-end gap-3" style="font-size: 0.85rem;">
              <a href="#" class="text-decoration-none" style="color: var(--text-muted);">Privacy Policy</a>
              <a href="#" class="text-decoration-none" style="color: var(--text-muted);">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/* ==========================================
   3. Highlight Active Page Navigation Links
   ========================================== */
function highlightActiveLink() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === page) {
      link.classList.add('active');
      link.style.color = 'var(--color-green)';
    } else {
      link.style.color = 'var(--text-secondary)';
    }
  });
}

/* ==========================================
   4. Authentication Navigation Logic
   ========================================== */
function setupAuthNav() {
  const container = document.getElementById('auth-buttons-container');
  if (!container) return;

  const path = window.location.pathname;
  const isSubFolder = path.includes('/pages/') || path.includes('/auth/');
  const rootPrefix = isSubFolder ? '../' : './';

  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (user) {
    container.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-glass dropdown-toggle px-3 py-2 fw-semibold d-flex align-items-center gap-2" type="button" id="userMenuDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="border-radius: 100px;">
          <i class="bi bi-person-circle fs-5 text-success"></i>
          <span>${user.name.split(' ')[0]}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userMenuDropdown" style="background-color: var(--bg-secondary); border-radius: 1rem; padding: 0.5rem;">
          <li>
            <a class="dropdown-item px-3 py-2 fw-medium d-flex align-items-center gap-2" href="${rootPrefix}dashboard.html" style="color: var(--text-primary); border-radius: 0.5rem;">
              <i class="bi bi-speedometer2 text-success"></i> Dashboard
            </a>
          </li>
          <li><hr class="dropdown-divider" style="border-color: var(--border-color);"></li>
          <li>
            <button class="dropdown-item px-3 py-2 fw-medium text-danger d-flex align-items-center gap-2" onclick="handleLogout()" style="border-radius: 0.5rem;">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    `;
  } else {
    container.innerHTML = `
      <a class="btn btn-glass px-4 py-2 fw-semibold" href="${rootPrefix}signin.html" style="border-radius: 100px;">Sign In</a>
      <a class="btn btn-glow-green px-4 py-2 fw-semibold" href="${rootPrefix}signup.html" style="border-radius: 100px;">Sign Up</a>
    `;
  }
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  const path = window.location.pathname;
  const isSubFolder = path.includes('/pages/') || path.includes('/auth/');
  window.location.href = isSubFolder ? '../index.html' : 'index.html';
}

/* ==========================================
   5. Scroll Animation (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* ==========================================
   6. Numeric Counters Animation
   ========================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const animateCounter = (counterEl) => {
    const target = parseFloat(counterEl.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = counterEl.getAttribute('data-decimal') === 'true';

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;

      if (isDecimal) {
        counterEl.innerText = currentValue.toFixed(1);
      } else {
        counterEl.innerText = Math.floor(currentValue).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        if (isDecimal) {
          counterEl.innerText = target.toFixed(1);
        } else {
          counterEl.innerText = target.toLocaleString();
        }
      }
    };

    requestAnimationFrame(updateValue);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================
   7. Scroll Capsule Nav Transformation
   ========================================== */
function initScrollCapsule() {
  const navbar = document.getElementById('navbar-capsule');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   Helper: Global Newsletter handler
   ========================================== */
window.handleGlobalNewsletter = function(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('input');
  const email = emailInput.value;

  alert(`Thank you for subscribing! We will send EV alerts and reports to ${email}.`);
  emailInput.value = '';
};

window.handleLogout = handleLogout;
window.toggleTheme = toggleTheme;
