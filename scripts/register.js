
import { registerAPI } from "../API/authAPI.js";
document.addEventListener("DOMContentLoaded", () => {

    const errorName = document.querySelector('.js-error-name');
    const errorEmail = document.querySelector('.js-error-email');
    const errorPassword = document.querySelector('.js-error-password');
    const errorConfirmPassword=document.querySelector('.js-error-confirm-password')

    function clearErrors(){
        errorName.textContent='';
        errorEmail.textContent='';
        errorPassword.textContent='';
        errorConfirmPassword.textContent='';

    }





    const form=document.querySelector('.js-register-form');
    const messageDiv = document.querySelector('.js-message');
    form.addEventListener('submit',async(event)=>{

        event.preventDefault();
        clearErrors();
        messageDiv.textContent = '';
        const name=document.querySelector('.js-name').value;
        const email=document.querySelector('.js-email').value;
        const password=document.querySelector('.js-password').value;
        const confirmPassword=document.querySelector('.js-confirm-password').value;


        let hasError=false;

        if(!name){
            errorName.textContent='Name is required'
            hasError=true;
        }
    
        if (!email) {
            errorEmail.textContent = "Email is required";
            hasError = true;
        }else{
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

            if (!emailPattern.test(email)) {
                errorEmail.textContent = "Enter a valid email";
                hasError = true;
}
        }

        if (!password) {
            errorPassword.textContent = "Password is required";
            hasError = true;
        }
        if(!confirmPassword){
            errorConfirmPassword.textContent="confirm password is required";
            hasError=true;

        }
        if(password && confirmPassword && password!==confirmPassword){
            errorConfirmPassword.textContent="password do not match";
            hasError=true;
        }

        if (hasError) return;

        const userData={
            name,
            email,
            password
        };
        try {
            const {response,data}=await registerAPI(userData);

            if(response.ok){

                messageDiv.style.color = "green";

                messageDiv.textContent = "Account created successfully!";

                setTimeout(()=>{
                    window.location.href="login.html";
                },2000)
            }else{
                messageDiv.style.color="red";

                if (data.field === "email") {

                    errorEmail.textContent = data.message;

                } else if (data.field === "name") {

                    errorName.textContent = data.message;

                } else if (data.field === "password") {

                    errorPassword.textContent = data.message;

                } else {
                    messageDiv.textContent = data.message || data.msg || "Something went wrong";
                }
                

            }
        } catch (error) {
            messageDiv.style.color="red";
            messageDiv.textContent="Server error. Please try again.";
            console.error(error);
        }



    })
    
});
