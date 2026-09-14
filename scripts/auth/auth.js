import { getUser } from '../../API/authAPI.js';
import { renderAuthUI } from './authUI.js';
import { attachLogoutHandler } from './authHandler.js';

export async function renderAuth() {
  const user = await getUser();

  renderAuthUI(user);

  if (user) {
    attachLogoutHandler();
  }
}