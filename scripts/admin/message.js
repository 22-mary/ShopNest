let messageTimeOut;
export function showMessage(messageElement,type,text,duration){
    clearTimeout(messageTimeOut);
    const icon=type==='success'?"✓" : "✕"
    messageElement.className = `add-product-message js-add-product-message ${type} `;
    messageElement.textContent=`${icon} ${text}`;

    messageTimeOut=setTimeout(()=>{
        messageElement.textContent="";
        messageElement.className = "add-product-message js-add-product-message";

    },duration);
}