export function renderAuthUI(user) {
  const authSection = document.querySelector('.js-auth-section');

  if (!authSection) return;

  if (user) {
    authSection.innerHTML = `
      <div class="auth-links">

        <span class="welcome-text">Hello, ${user.name}</span>

        ${
          user.role === 'admin'
            ? `<a href="admin.html" class="header-link">Admin</a>`
            : ''
        }

        <button class="logout-btn js-logout-btn">Logout</button>

      </div>
    `;
  } else {
    authSection.innerHTML = `
      <a href="login.html" class="header-link">Login</a>
      <a href="register.html" class="header-link">Register</a>
    `;
  }
}