/**
 * Authentication Controller for Electric Vehicle Awareness Website
 * Manages user registration, login, validation, password strength checking, and state storage.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Bind password toggles if any exist on page
  setupPasswordToggles();

  // Bind signup form handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignupSubmit);
    setupPasswordStrengthChecker();
  }

  // Bind login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  // Check if user is already logged in and redirect if on auth pages
  checkSessionRedirect();
});

/* ==========================================
   1. Dynamic Password Visibility Toggle
   ========================================== */
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle');
  
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-target');
      const input = document.getElementById(inputId);
      const icon = btn.querySelector('i');
      
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'bi bi-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'bi bi-eye';
        }
      }
    });
  });
}

/* ==========================================
   2. Real-time Password Strength Checker
   ========================================== */
function setupPasswordStrengthChecker() {
  const passwordInput = document.getElementById('signup-password');
  const strengthIndicator = document.getElementById('password-strength-bar');
  const strengthText = document.getElementById('password-strength-text');
  
  if (!passwordInput || !strengthIndicator || !strengthText) return;

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const result = evaluatePasswordStrength(password);
    
    // Reset classes
    strengthIndicator.className = 'progress-bar';
    strengthIndicator.style.width = '0%';
    strengthText.innerText = '';

    if (password.length === 0) return;

    // Apply color and text based on strength rating
    if (result.score === 1) {
      strengthIndicator.classList.add('bg-danger');
      strengthIndicator.style.width = '25%';
      strengthText.innerText = 'Weak (add numbers/caps)';
      strengthText.style.color = '#ef4444';
    } else if (result.score === 2) {
      strengthIndicator.classList.add('bg-warning');
      strengthIndicator.style.width = '50%';
      strengthText.innerText = 'Moderate (add symbols)';
      strengthText.style.color = '#f59e0b';
    } else if (result.score === 3) {
      strengthIndicator.classList.add('bg-info');
      strengthIndicator.style.width = '75%';
      strengthText.innerText = 'Strong';
      strengthText.style.color = '#06b6d4';
    } else if (result.score === 4) {
      strengthIndicator.classList.add('bg-success');
      strengthIndicator.style.width = '100%';
      strengthText.innerText = 'Very Strong';
      strengthText.style.color = '#10b981';
    }
  });
}

function evaluatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  return { score };
}

/* ==========================================
   3. Sign Up Submission & Local Storage Registry
   ========================================== */
function handleSignupSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const interest = document.getElementById('signup-interest').value;
  const errorAlert = document.getElementById('signup-error-alert');

  if (errorAlert) errorAlert.classList.add('d-none');

  // Input Validations
  if (!name || !email || !password || !confirmPassword) {
    showAuthError(errorAlert, 'All fields are required.');
    return;
  }

  if (password !== confirmPassword) {
    showAuthError(errorAlert, 'Passwords do not match.');
    return;
  }

  const strength = evaluatePasswordStrength(password);
  if (strength.score < 2) {
    showAuthError(errorAlert, 'Password is too weak. Please choose a stronger password.');
    return;
  }

  // Get existing users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Check if user already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    showAuthError(errorAlert, 'An account with this email already exists.');
    return;
  }

  // Create new user record
  const newUser = {
    name,
    email,
    password, // Store as plaintext for simple mock auth logic
    interest,
    favorites: [],
    recentlyViewed: []
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto-login after successful registration
  localStorage.setItem('currentUser', JSON.stringify({
    name: newUser.name,
    email: newUser.email,
    interest: newUser.interest
  }));

  alert('Registration successful! Welcome to EcoVolt.');
  window.location.href = 'dashboard.html';
}

/* ==========================================
   4. Login Submission & Authentication Verification
   ========================================== */
function handleLoginSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorAlert = document.getElementById('login-error-alert');

  if (errorAlert) errorAlert.classList.add('d-none');

  if (!email || !password) {
    showAuthError(errorAlert, 'All fields are required.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find matching user credentials
  const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!matchedUser) {
    showAuthError(errorAlert, 'Invalid email or password.');
    return;
  }

  // Set active session
  localStorage.setItem('currentUser', JSON.stringify({
    name: matchedUser.name,
    email: matchedUser.email,
    interest: matchedUser.interest
  }));

  window.location.href = 'dashboard.html';
}

/* ==========================================
   5. Authentication Helper Functions
   ========================================== */
function showAuthError(element, message) {
  if (element) {
    element.innerText = message;
    element.classList.remove('d-none');
    element.classList.add('animate__animated', 'animate__headShake');
  } else {
    alert(message);
  }
}

function checkSessionRedirect() {
  const user = localStorage.getItem('currentUser');
  const path = window.location.pathname;
  const isAuthPage = path.includes('login.html') || path.includes('signin.html') || path.includes('signup.html');

  if (user && isAuthPage) {
    window.location.href = 'dashboard.html';
  }
}
