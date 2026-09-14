import { initializeAdminPage } from "./adminPage.js";
import { getUser } from "../../API/authAPI.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const user = await getUser();

        if (!user || user.role !== "admin") {
            window.location.href = "index.html";
            return;
        }

        initializeAdminPage();
        
    } catch (error) {
        console.error(error);

        window.location.href = "index.html";
    }
});