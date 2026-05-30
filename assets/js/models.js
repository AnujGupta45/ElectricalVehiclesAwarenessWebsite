/**
 * EV Models Catalog Controller (Ola & Tesla Edition)
 * Manages Ola and Tesla database assets, filters, sort orders, favorites, and skeleton loading frames.
 */

// 1. Vehicle Catalog Database (Actual Ola and Tesla fleets)
const EV_DATABASE = [
  {
    id: "ola-s1-pro",
    name: "S1 Pro Gen 2",
    brand: "Ola",
    type: "Scooter",
    battery: "4 kWh",
    range: 121, // miles
    charging: "6.5 hr (Home AC)",
    price: 1799, // USD equivalent
    acceleration: "2.6s (0-25 mph)",
    topSpeed: "75 mph",
    drive: "Hub Motor",
    seats: 2,
    image: "https://images.unsplash.com/photo-1595152230551-214d0095a96c?auto=format&fit=crop&w=600&q=80",
    description: "India's bestselling premium electric scooter. Features interactive screens, digital keyless ignition, cruise controls, and multiple riding modes (Eco, Normal, Sport, Hyper)."
  },
  {
    id: "ola-roadster-pro",
    name: "Roadster Pro",
    brand: "Ola",
    type: "Motorcycle",
    battery: "16 kWh",
    range: 360,
    charging: "30 min (DC Fast)",
    price: 4999,
    acceleration: "1.2s (0-25 mph)",
    topSpeed: "120 mph",
    drive: "Mid-drive Chain",
    seats: 2,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    description: "Ola's highly-anticipated flagship electric sports motorcycle. Boasts ADAS collision warning system, liquid-cooled battery pack, and race-tuned throttle dynamics."
  },
  {
    id: "tesla-m3",
    name: "Model 3",
    brand: "Tesla",
    type: "Sedan",
    battery: "75 kWh",
    range: 272,
    charging: "25 min (Supercharger)",
    price: 38990,
    acceleration: "4.2s (0-60 mph)",
    topSpeed: "145 mph",
    drive: "Dual Motor AWD",
    seats: 5,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
    description: "The modern benchmark for electric sedans globally. Built-in autopilot driving assistance, clean dual-screen minimal cabin layout, and five-star crash ratings."
  },
  {
    id: "tesla-my",
    name: "Model Y",
    brand: "Tesla",
    type: "SUV",
    battery: "81 kWh",
    range: 310,
    charging: "27 min (Supercharger)",
    price: 44990,
    acceleration: "4.8s (0-60 mph)",
    topSpeed: "135 mph",
    drive: "Dual Motor AWD",
    seats: 5,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
    description: "The world's bestselling vehicle crossover SUV. Extremely spacious cabin configuration with panoramic sunroof, cargo seating, and standard safety suites."
  },
  {
    id: "tesla-cybertruck",
    name: "Cybertruck",
    brand: "Tesla",
    type: "Truck",
    battery: "123 kWh",
    range: 340,
    charging: "40 min (Supercharger)",
    price: 79990,
    acceleration: "2.6s (0-60 mph)",
    topSpeed: "130 mph",
    drive: "Tri-Motor Cyberbeast",
    seats: 5,
    image: "https://images.unsplash.com/photo-1698246397354-94943fa58a43?auto=format&fit=crop&w=600&q=80",
    description: "Stainless steel exoskeleton utility truck. Armed with shatter-proof armor windows, steer-by-wire controls, and massive utility storage beds."
  },
  {
    id: "tesla-roadster",
    name: "Roadster 2.0",
    brand: "Tesla",
    type: "Sportscar",
    battery: "200 kWh",
    range: 620,
    charging: "45 min (Supercharger)",
    price: 200000,
    acceleration: "1.9s (0-60 mph)",
    topSpeed: "250+ mph",
    drive: "Quad-Motor AWD",
    seats: 4,
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=600&q=80",
    description: "The ultimate hypercar representation. High aerodynamic efficiency, cold gas thruster support options, and a massive 200 kWh battery pack yielding 620 miles of range."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('models-grid');
  if (!grid) return;

  // Initialize display
  renderModels(EV_DATABASE);
  populateFilters();

  // Setup event listeners for filtering
  const searchInput = document.getElementById('search-ev');
  const brandFilter = document.getElementById('filter-brand');
  const typeFilter = document.getElementById('filter-type');
  const sortSelect = document.getElementById('filter-sort');
  const priceSlider = document.getElementById('filter-price');
  const priceValue = document.getElementById('price-value');
  const rangeSlider = document.getElementById('filter-range');
  const rangeValue = document.getElementById('range-value');

  if (searchInput) searchInput.addEventListener('input', runFiltersWithSkeleton);
  if (brandFilter) brandFilter.addEventListener('change', runFiltersWithSkeleton);
  if (typeFilter) typeFilter.addEventListener('change', runFiltersWithSkeleton);
  if (sortSelect) sortSelect.addEventListener('change', runFiltersWithSkeleton);

  if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', () => {
      priceValue.innerText = `$${parseInt(priceSlider.value).toLocaleString()}`;
      runFiltersWithSkeleton();
    });
  }

  if (rangeSlider && rangeValue) {
    rangeSlider.addEventListener('input', () => {
      rangeValue.innerText = `${rangeSlider.value} miles`;
      runFiltersWithSkeleton();
    });
  }
});

/* ==========================================
   2. Render Model Cards
   ========================================== */
function renderModels(models) {
  const grid = document.getElementById('models-grid');
  if (!grid) return;

  if (models.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
        <h4 class="fw-bold">No EV Models Match</h4>
        <p class="text-muted">Try adjusting your filters or search terms.</p>
      </div>
    `;
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let userFavs = [];
  if (currentUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matched = users.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (matched && matched.favorites) {
      userFavs = matched.favorites;
    }
  }

  grid.innerHTML = models.map(car => {
    const isFav = userFavs.includes(car.id);
    const heartIcon = isFav ? 'bi-heart-fill text-danger' : 'bi-heart';

    return `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card glass-card h-100 border-0 p-3 overflow-hidden position-relative" style="border-radius: 1.5rem; transition: var(--transition-smooth);">
          <!-- Favorite Button -->
          <button onclick="toggleFavorite(event, '${car.id}')" class="btn btn-glass position-absolute d-flex align-items-center justify-content-center border-0 shadow-sm" style="top: 20px; right: 20px; z-index: 10; width: 42px; height: 42px; border-radius: 50%;" aria-label="Add to favorites">
            <i class="bi ${heartIcon} fs-5" id="fav-icon-${car.id}"></i>
          </button>
          
          <!-- Large Image Wrapper -->
          <div class="rounded-4 overflow-hidden mb-3 d-flex align-items-center justify-content-center" style="height: 200px; background: linear-gradient(135deg, var(--color-green-glow), var(--color-blue-glow)); border-radius: 1rem;">
            <img src="${car.image}" alt="${car.brand} ${car.name}" class="img-fluid object-fit-contain p-2" style="max-height: 100%; transition: var(--transition-smooth); transform: scale(1);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="d-none flex-column align-items-center text-center p-3 text-success">
              <i class="bi bi-car-front-fill fs-1"></i>
              <span class="fw-bold">${car.brand} ${car.name}</span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-body p-1 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span class="badge mb-2 px-2.5 py-1.5" style="background-color: var(--color-blue-glow); color: var(--color-blue); font-weight: 700; font-size: 0.75rem; border-radius: 50px;">${car.type}</span>
                  <h4 class="card-title fw-bold mb-0" style="font-family: var(--font-heading); font-size: 1.25rem;">${car.name}</h4>
                  <p class="text-muted mb-0 small">by ${car.brand}</p>
                </div>
                <div class="text-end">
                  <span class="fs-5 fw-extrabold" style="color: var(--color-green);">$${car.price.toLocaleString()}</span>
                </div>
              </div>

              <!-- Quick Specs Grid -->
              <div class="row g-2 my-3 text-center" style="font-size: 0.85rem;">
                <div class="col-4 border-end" style="border-color: var(--border-color) !important;">
                  <i class="bi bi-battery-charging text-success fs-5 d-block mb-1"></i>
                  <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">Battery</span>
                  <span class="fw-bold">${car.battery}</span>
                </div>
                <div class="col-4 border-end" style="border-color: var(--border-color) !important;">
                  <i class="bi bi-speedometer text-info fs-5 d-block mb-1"></i>
                  <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">Range</span>
                  <span class="fw-bold">${car.range} mi</span>
                </div>
                <div class="col-4">
                  <i class="bi bi-lightning-charge text-warning fs-5 d-block mb-1"></i>
                  <span class="text-muted d-block" style="font-size: 0.7rem; font-weight: 700;">Charge Time</span>
                  <span class="fw-bold text-nowrap" style="font-size: 0.75rem;">${car.charging.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <!-- Details Button -->
            <button onclick="viewCarDetails('${car.id}')" class="btn btn-glow-green w-100 py-3 fw-bold mt-2" style="font-size: 0.9rem;">
              View Details <i class="bi bi-arrow-right-short ms-1 fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================
   3. Search, Filter & Sort Algorithms
   ========================================== */
function populateFilters() {
  const brands = [...new Set(EV_DATABASE.map(c => c.brand))];
  const types = [...new Set(EV_DATABASE.map(c => c.type))];

  const brandSelect = document.getElementById('filter-brand');
  const typeSelect = document.getElementById('filter-type');

  if (brandSelect) {
    brands.forEach(brand => {
      brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
  }

  if (typeSelect) {
    types.forEach(type => {
      typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
    });
  }
}

function runFiltersWithSkeleton() {
  const grid = document.getElementById('models-grid');
  if (!grid) return;

  // 1. Inject Skeleton Loaders immediately
  grid.innerHTML = Array(3).fill(0).map(() => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card glass-card h-100 border-0 p-3" style="border-radius: 1.5rem;">
        <div class="skeleton skeleton-image rounded-4"></div>
        <div class="skeleton skeleton-text w-50"></div>
        <div class="skeleton skeleton-text w-75"></div>
        <div class="skeleton skeleton-text w-100 mb-4"></div>
        <div class="skeleton skeleton-text w-100" style="height: 40px; border-radius: 0.85rem;"></div>
      </div>
    </div>
  `).join('');

  // 2. Set timeout to simulate network fetch and render actual models
  setTimeout(() => {
    const query = document.getElementById('search-ev')?.value.toLowerCase() || '';
    const brand = document.getElementById('filter-brand')?.value || 'all';
    const type = document.getElementById('filter-type')?.value || 'all';
    const maxPrice = parseInt(document.getElementById('filter-price')?.value || '250000');
    const minRange = parseInt(document.getElementById('filter-range')?.value || '100');
    const sortBy = document.getElementById('filter-sort')?.value || 'default';

    let filtered = EV_DATABASE.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(query) || car.brand.toLowerCase().includes(query);
      const matchesBrand = brand === 'all' || car.brand === brand;
      const matchesType = type === 'all' || car.type === type;
      const matchesPrice = car.price <= maxPrice;
      const matchesRange = car.range >= minRange;

      return matchesSearch && matchesBrand && matchesType && matchesPrice && matchesRange;
    });

    // Run sorting rules
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'range-desc') {
      filtered.sort((a, b) => b.range - a.range);
    }

    renderModels(filtered);
  }, 400); // 400ms loading skeleton feels highly responsive yet realistic!
}

/* ==========================================
   4. Favorites Tracker Logic
   ========================================== */
window.toggleFavorite = function(event, carId) {
  event.stopPropagation();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    alert('Please sign up or login to save your favorite EV models and see them in your personalized dashboard.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());

  if (userIdx === -1) return;

  if (!users[userIdx].favorites) {
    users[userIdx].favorites = [];
  }

  const favIndex = users[userIdx].favorites.indexOf(carId);
  const heartIcon = document.getElementById(`fav-icon-${carId}`);

  if (favIndex === -1) {
    users[userIdx].favorites.push(carId);
    if (heartIcon) {
      heartIcon.className = 'bi bi-heart-fill text-danger fs-5';
    }
  } else {
    users[userIdx].favorites.splice(favIndex, 1);
    if (heartIcon) {
      heartIcon.className = 'bi bi-heart fs-5';
    }
  }

  localStorage.setItem('users', JSON.stringify(users));
};

/* ==========================================
   5. Launch Details Spec Modal
   ========================================== */
window.viewCarDetails = function(carId) {
  const car = EV_DATABASE.find(c => c.id === carId);
  if (!car) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    
    if (userIdx !== -1) {
      if (!users[userIdx].recentlyViewed) {
        users[userIdx].recentlyViewed = [];
      }
      const viewIdx = users[userIdx].recentlyViewed.indexOf(carId);
      if (viewIdx !== -1) {
        users[userIdx].recentlyViewed.splice(viewIdx, 1);
      }
      users[userIdx].recentlyViewed.unshift(carId);
      if (users[userIdx].recentlyViewed.length > 6) {
        users[userIdx].recentlyViewed.pop();
      }
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  let modalEl = document.getElementById('details-modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'details-modal';
    modalEl.className = 'modal fade';
    modalEl.setAttribute('tabindex', '-1');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modalEl);
  }

  const isFavorite = currentUser && JSON.parse(localStorage.getItem('users'))
    .find(u => u.email.toLowerCase() === currentUser.email.toLowerCase())
    .favorites.includes(car.id);

  modalEl.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 shadow" style="border-radius: 1.5rem; overflow: hidden; background-color: var(--bg-secondary);">
        <div class="modal-header border-0 pb-0" style="padding: 2rem 2rem 0.5rem 2rem;">
          <h4 class="modal-title fw-bold" style="font-family: var(--font-heading); font-size: 1.5rem;">${car.brand} ${car.name}</h4>
          <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding: 2rem;">
          <div class="row g-4 align-items-center">
            <div class="col-md-5 d-flex flex-column align-items-center justify-content-center p-4 rounded-4" style="background: linear-gradient(135deg, var(--color-green-glow), var(--color-blue-glow)); min-height: 220px;">
              <img src="${car.image}" alt="${car.brand} ${car.name}" class="img-fluid object-fit-contain" style="max-height: 180px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="d-none flex-column align-items-center text-center p-3 text-success">
                <i class="bi bi-car-front-fill fs-1"></i>
                <span class="fw-bold">${car.brand}</span>
              </div>
            </div>
            
            <div class="col-md-7">
              <p class="lead mb-4" style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7;">${car.description}</p>
              
              <h5 class="fw-bold mb-3 border-bottom pb-1" style="font-family: var(--font-heading); font-size: 1rem; border-color: var(--border-color) !important;">Specs Matrix</h5>
              <div class="row g-2" style="font-size: 0.9rem;">
                <div class="col-6 mb-1">
                  <span class="text-muted">Type:</span> <strong class="text-primary">${car.type}</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Base Price:</span> <strong style="color: var(--color-green); font-weight: 800;">$${car.price.toLocaleString()}</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Range:</span> <strong>${car.range} miles</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Battery Capacity:</span> <strong>${car.battery}</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Fast Charge:</span> <strong>${car.charging}</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Drive Setup:</span> <strong>${car.drive}</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Acceleration:</span> <strong>${car.acceleration}</strong>
                </div>
                <div class="col-6 mb-1">
                  <span class="text-muted">Max Velocity:</span> <strong>${car.topSpeed}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0" style="padding: 0.5rem 2rem 2rem 2rem;">
          <button type="button" class="btn btn-glass px-4 py-2.5" data-bs-dismiss="modal" style="border-radius: 0.75rem;">Close</button>
          <button onclick="toggleFavorite(event, '${car.id}'); updateModalFavBtn('${car.id}');" class="btn btn-glow-green px-4 py-2.5 d-flex align-items-center gap-2" id="modal-fav-btn" style="border-radius: 0.75rem;">
            <i class="${isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'}"></i> Favorite
          </button>
        </div>
      </div>
    </div>
  `;

  const bootstrapModal = new bootstrap.Modal(modalEl);
  bootstrapModal.show();
};

window.updateModalFavBtn = function(carId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const matched = users.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
  
  if (matched && matched.favorites) {
    const isFav = matched.favorites.includes(carId);
    const btn = document.getElementById('modal-fav-btn');
    if (btn) {
      btn.innerHTML = `<i class="${isFav ? 'bi bi-heart-fill' : 'bi bi-heart'}"></i> Favorite`;
    }
  }
};
