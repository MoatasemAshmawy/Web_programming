const f_name = document.querySelector('#f_name');
const l_name = document.querySelector('#l_name');
const email = document.querySelector('#email');
const address = document.querySelector('#address');
const register_form = document.querySelector('.register_form');

let error = document.createElement('h3');
error.innerText = 'Email is Already Taken';
error.style.color = 'red';

let text = document.createElement('h3');
text.innerText = 'Info Updated Succesfully';
text.style.color = 'green';

register_form.addEventListener('submit',(e)=>{
    error.remove();
    text.remove();
    e.preventDefault();

    if(password.value !== confirm_password.value){
        register_wrapper.after(error2);
        return;
    }
    
    fetch('/updateinfo', {
         
        // Adding method type
        method: "POST",
         
        // Adding body or contents to send
        body: JSON.stringify({
            email: email.value,
            address: address.value,
            f_name: f_name.value,
            l_name: l_name.value
        }),
         
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
     
    // Converting to JSON
    .then(response => response.json())
    .then((res)=>{
        if(res.register){
            address.after(text);
        }
        else{
            address.after(error);
        }
    })
     .catch(err =>console.error(err));
    
    })