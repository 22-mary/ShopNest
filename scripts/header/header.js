import { updateCartUI } from '../utils/cartUI.js';

export async function initializeHeader() {
    await updateCartUI();
}