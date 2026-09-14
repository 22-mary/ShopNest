export async function getUser(){
    try {
        const response=await fetch('http://localhost:8000/api/auth/me',{
            credentials:'include',
            cache: 'no-store'
        });
        if(!response.ok)
            return null;
        const data=await response.json()
        return data.user
    } catch (error) {
        console.error(error)
        
    }
}

export async function logoutAPI() {
  const response = await fetch('http://localhost:8000/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

export async function loginAPI(userData) {
    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    return {response,data};
}

export async function registerAPI(userData){

    const response= await fetch('http://localhost:8000/api/auth/register',{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(userData)
            })
            const data=await response.json();
            return {response,data};

}