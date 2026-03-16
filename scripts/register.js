const form=document.querySelector('.js-register-form');
form.addEventListener('submit',async(event)=>{

    event.preventDefault();
    const name=document.querySelector('.js-name').value;
    const email=document.querySelector('.js-email').value;
    const password=document.querySelector('.js-password').value;
    const userData={
        name,
        email,
        password
    };
    try {
        const response= await fetch('http://localhost:8000/api/auth/register',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userData)
        })
        const data=await response.json();
        console.log(data);
        if(response.ok){
            alert('Accout created succesfully!');
            window.location.href="login.html";
        }
    } catch (error) {
        console.error(error);
        
    }



})