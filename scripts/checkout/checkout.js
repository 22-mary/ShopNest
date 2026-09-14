import { renderAuth } from '../auth/auth.js';
import { initCheckoutPage } from './checkoutPage.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderAuth();
  await initCheckoutPage();
});