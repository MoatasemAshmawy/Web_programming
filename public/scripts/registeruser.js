const f_name = document.querySelector('#f_name');
const l_name = document.querySelector('#l_name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirm_password = document.querySelector('#confirm_password');
const register_wrapper = document.querySelector('.register_wrapper');
const register_form = document.querySelector('.register_form');

let error = document.createElement('h3');
error.innerText = 'Email is Already Taken';
error.style.color = 'red';


let error2 = document.createElement('h3');
error2.innerText = 'Passwords do not match';
error2.style.color = 'red';


register_form.addEventListener('submit',(e)=>{
    error.remove();
    error2.remove();
    e.preventDefault();

    if(password.value !== confirm_password.value){
        register_wrapper.after(error2);
        return;
    }
    
    fetch('/registeruser', {
         
        // Adding method type
        method: "POST",
         
        // Adding body or contents to send
        body: JSON.stringify({
            email: email.value,
            password: password.value,
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
            window.location.href ="/myaccount";
        }
        else{
            register_wrapper.after(error);
        }
    })
     .catch(err =>console.error(err));
    
    })