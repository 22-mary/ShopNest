import { initProductPage } from './productPage.js';
import { renderAuth } from '../auth/auth.js';
import { initializeHeader } from '../header/header.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderAuth();
  initializeHeader();
  await initProductPage();
});
