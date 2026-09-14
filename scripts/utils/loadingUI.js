export function showLoadingSpinner(message='Loading...'){
    const spinner=document.querySelector('.js-loading-spinner');

    if(!spinner)return;

    spinner.style.display='block';
    
    const messageElement=spinner.querySelector('p');

    if (messageElement) {
    messageElement.textContent = message;
    }

}

export function hideLoadingSpinner(){
    const spinner=document.querySelector('.js-loading-spinner');

    if(!spinner)return;

    spinner.style.display='none';
}