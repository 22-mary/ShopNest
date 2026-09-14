import { logoutAPI } from "../../API/authAPI.js";

export function attachLogoutHandler() {
  const logoutButton = document.querySelector('.js-logout-btn');

  if (!logoutButton) return;

  logoutButton.addEventListener('click', async () => {
    try {
      await logoutAPI();
      location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
}