const form=document.querySelector('.js-login-form');
form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    const email=document.querySelector('.js-email').value;
    const password=document.querySelector('.js-password').value;
    
    const userData={
        email,
        password
    };
    try {
        const response=await fetch('http://localhost:8000/api/auth/login',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(userData),
        }) 
        const user=await response.json();
        console.log(user);
        if(response.ok){
            alert('logged in successfully');
        }
    } catch (error) {
        console.error(error);
        
    }
})