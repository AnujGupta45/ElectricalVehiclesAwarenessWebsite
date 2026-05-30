/**
 * User Dashboard Controller (Ola & Tesla Redesign)
 * Checks authentication, renders profile elements, configures dynamic Chart.js savings,
 * maps saved/viewed cars, and recommends Ola/Tesla vehicles based on user interest selectors.
 */

// Global reference to the database (linked from models.js)
// EV_DATABASE has elements: ola-s1-pro, ola-roadster-pro, tesla-m3, tesla-my, tesla-cybertruck, tesla-roadster

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = checkAuth();
  if (!currentUser) return;

  // Initialize display widgets
  renderProfileHeader(currentUser);
  updateDashboardImpact(currentUser);
  renderDashboardVehicles(currentUser);
  
  // Initialize Chart.js
  initSavingsChart(currentUser);
  
  // Set interest selection value
  const interestSelect = document.getElementById('dashboard-interest-select');
  if (interestSelect) {
    interestSelect.value = currentUser.interest;
    interestSelect.addEventListener('change', (e) => {
      handleInterestChange(e.target.value);
    });
  }
});

/* ==========================================
   1. Access Protection Check
   ========================================== */
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'signin.html';
    return null;
  }
  return currentUser;
}

/* ==========================================
   2. Profile Header Rendering
   ========================================== */
function renderProfileHeader(user) {
  const welcomeText = document.getElementById('dashboard-welcome-title');
  const emailText = document.getElementById('dashboard-user-email');
  
  if (welcomeText) {
    welcomeText.innerText = `Welcome back, ${user.name}!`;
  }
  if (emailText) {
    emailText.innerText = user.email;
  }
}

/* ==========================================
   3. Calculate & Render Impact Statistics
   ========================================== */
function updateDashboardImpact(user) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const matchedUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  const co2El = document.getElementById('stat-co2-saved');
  const fuelEl = document.getElementById('stat-cash-saved');
  const treesEl = document.getElementById('stat-trees-planted');

  let favoriteCount = 0;
  if (matchedUser && matchedUser.favorites) {
    favoriteCount = matchedUser.favorites.length;
  }

  // Savings formulas
  const multiplier = favoriteCount > 0 ? favoriteCount : 1;
  const co2Target = multiplier * 4.6;
  const cashTarget = multiplier * 1250;
  const treesTarget = Math.round(co2Target * 50);

  if (co2El) co2El.setAttribute('data-target', co2Target.toString());
  if (fuelEl) fuelEl.setAttribute('data-target', cashTarget.toString());
  if (treesEl) treesEl.setAttribute('data-target', treesTarget.toString());
}

/* ==========================================
   4. Render Favorites, History, & Recommendations
   ========================================== */
function renderDashboardVehicles(user) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const matchedUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase()) || { favorites: [], recentlyViewed: [] };

  const favGrid = document.getElementById('dashboard-favorites-grid');
  const recentGrid = document.getElementById('dashboard-recent-grid');
  const recGrid = document.getElementById('dashboard-recommendations-grid');

  if (favGrid) {
    const favs = EV_DATABASE.filter(car => matchedUser.favorites.includes(car.id));
    if (favs.length === 0) {
      favGrid.innerHTML = `
        <div class="col-12 text-center py-4 glass-card border-dashed">
          <i class="bi bi-heart fs-2 text-muted mb-2 d-block"></i>
          <p class="text-muted mb-3">No saved favorites yet.</p>
          <a href="models.html" class="btn btn-glass px-4 py-2">Explore Models</a>
        </div>
      `;
    } else {
      favGrid.innerHTML = renderDashboardCarRow(favs);
    }
  }

  if (recentGrid) {
    const recentlyViewedIds = matchedUser.recentlyViewed || [];
    const recents = recentlyViewedIds
      .map(id => EV_DATABASE.find(car => car.id === id))
      .filter(car => car !== undefined);

    if (recents.length === 0) {
      recentGrid.innerHTML = `
        <div class="col-12 text-center py-4 glass-card border-dashed">
          <i class="bi bi-clock-history fs-2 text-muted mb-2 d-block"></i>
          <p class="text-muted mb-0">No recently viewed models yet.</p>
        </div>
      `;
    } else {
      recentGrid.innerHTML = renderDashboardCarRow(recents);
    }
  }

  if (recGrid) {
    renderRecommendations(user.interest);
  }
}

function renderRecommendations(interest) {
  const recGrid = document.getElementById('dashboard-recommendations-grid');
  if (!recGrid) return;

  let filtered = [];

  switch (interest) {
    case 'Range':
      // Tesla Roadster 2.0 (620mi) and Tesla Cybertruck (340mi)
      filtered = EV_DATABASE.filter(car => car.range >= 340);
      break;
    case 'Budget':
      // Ola S1 Pro ($1799) and Ola Roadster ($4999)
      filtered = EV_DATABASE.filter(car => car.price <= 5000);
      break;
    case 'Performance':
      // Tesla Roadster (1.9s) and Cybertruck (2.6s) and Ola Roadster Pro (1.2s to 25mph)
      filtered = EV_DATABASE.filter(car => parseFloat(car.acceleration) < 3.0);
      break;
    case 'Utility':
      // Tesla Cybertruck (Truck) and Model Y (SUV)
      filtered = EV_DATABASE.filter(car => car.type === 'SUV' || car.type === 'Truck');
      break;
    default:
      filtered = EV_DATABASE.slice(0, 3);
  }

  recGrid.innerHTML = renderDashboardCarRow(filtered);
}

function renderDashboardCarRow(cars) {
  return cars.map(car => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card glass-card h-100 border-0 p-3 overflow-hidden" style="border-radius: 1.5rem; transition: var(--transition-smooth);">
        <div class="rounded-4 overflow-hidden mb-3 d-flex align-items-center justify-content-center" style="height: 140px; background: linear-gradient(135deg, var(--color-green-glow), var(--color-blue-glow));">
          <img src="${car.image}" alt="${car.brand} ${car.name}" class="img-fluid object-fit-contain p-2 hover-scale" style="max-height: 100%; transition: var(--transition-smooth);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="d-none flex-column align-items-center text-center p-3 text-success">
            <i class="bi bi-car-front-fill fs-2"></i>
            <span class="fw-bold">${car.name}</span>
          </div>
        </div>
        <div class="card-body p-0 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 class="card-title fw-bold mb-0" style="font-family: var(--font-heading); font-size: 1.1rem;">${car.name}</h5>
                <span class="text-muted" style="font-size: 0.75rem;">${car.brand} &bull; ${car.type}</span>
              </div>
              <span class="fw-bold text-success" style="font-size: 0.95rem;">$${car.price.toLocaleString()}</span>
            </div>
            <div class="d-flex justify-content-between border-top pt-2 mt-2" style="font-size: 0.8rem;">
              <span>Range: <strong>${car.range} mi</strong></span>
              <span>Charging: <strong>${car.charging.split(' ')[0]}</strong></span>
            </div>
          </div>
          <button onclick="viewCarDetails('${car.id}')" class="btn btn-glass w-100 py-2.5 fw-semibold mt-3" style="font-size: 0.85rem; border-radius: 0.75rem;">
            Specs & details <i class="bi bi-arrow-right-short ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================
   5. Dynamic Interest Selection
   ========================================== */
function handleInterestChange(newInterest) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;
  currentUser.interest = newInterest;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
  if (userIdx !== -1) {
    users[userIdx].interest = newInterest;
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Refresh recommendation grid
  renderRecommendations(newInterest);
}

/* ==========================================
   6. Chart.js Projection Graph Integration
   ========================================== */
function initSavingsChart(user) {
  const canvas = document.getElementById('dashboard-savings-chart');
  if (!canvas) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const matchedUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  let favoriteCount = 0;
  if (matchedUser && matchedUser.favorites) {
    favoriteCount = matchedUser.favorites.length;
  }

  const multiplier = favoriteCount > 0 ? favoriteCount : 1;
  const annualGas = multiplier * 1820;
  const annualEV = multiplier * 340;

  // Prepare 5 Year cumulative cost projections
  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const gasData = [annualGas, annualGas * 2, annualGas * 3, annualGas * 4, annualGas * 5];
  const evData = [annualEV, annualEV * 2, annualEV * 3, annualEV * 4, annualEV * 5];

  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(9, 13, 22, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#525f7f';

  // Create line chart
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Gasoline Vehicle Costs',
          data: gasData,
          borderColor: '#94a3b8',
          borderWidth: 2,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.2
        },
        {
          label: 'Electric Vehicle Costs',
          data: evData,
          borderColor: '#10b981',
          borderWidth: 3,
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          fill: true,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: 'Manrope', size: 12, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Manrope' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { 
            color: textColor,
            font: { family: 'Manrope' },
            callback: function(value) { return '$' + value.toLocaleString(); }
          }
        }
      }
    }
  });
}

/* ==========================================
   7. Clear History Helper
   ========================================== */
window.clearHistory = function() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
  
  if (userIdx !== -1) {
    users[userIdx].recentlyViewed = [];
    localStorage.setItem('users', JSON.stringify(users));
    
    const recentGrid = document.getElementById('dashboard-recent-grid');
    if (recentGrid) {
      recentGrid.innerHTML = `
        <div class="col-12 text-center py-4 glass-card border-dashed">
          <i class="bi bi-clock-history fs-2 text-muted mb-2 d-block"></i>
          <p class="text-muted mb-0">No recently viewed models yet.</p>
        </div>
      `;
    }
  }
};
