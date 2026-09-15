import { loginAPI } from "../../API/authAPI.js";
export function attachLoginHandler() {
    const form = document.querySelector('.js-login-form');
    const messageDiv = document.querySelector('.js-message');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('.js-email').value;
        const password = document.querySelector('.js-password').value;

        const userData = {
            email,
            password
        };

        try {
            const {response,data} = await loginAPI(userData);
            console.log(data)

           if(response.ok){

            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Logged in successfully!';
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');

            setTimeout(() => {

                if (redirect) {
                    window.location.href = redirect;
                } else {
                    window.location.href = 'index.html';
                }
            }, 2000);

            
           }else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Invalid email or password';
            }

            

        } catch (error) {


            messageDiv.style.color='red';
            messageDiv.textContent='Server Error please try again';
            console.error(error);
        }
    });
}