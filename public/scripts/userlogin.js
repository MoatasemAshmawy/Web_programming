const login_wrapper = document.querySelector('.login_wrapper');
const login_form = document.querySelector('.login_form');
let password = document.querySelector('#password');
let email = document.querySelector('#email');
let error = document.createElement('h3');
error.innerText = 'Invalid Email or Password';


login_form.addEventListener('submit',(e)=>{

    e.preventDefault();
    
    fetch('/auth/user', {
         
        // Adding method type
        method: "POST",
         
        // Adding body or contents to send
        body: JSON.stringify({
            email: email.value,
            password: password.value
           
        }),
         
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
     
    // Converting to JSON
    .then(response => response.json())
    .then((res)=>{
        if(res.login){
            window.location.href ="/myaccount";
        }
        else{
            login_wrapper.after(error);
        }
    })
     .catch(err =>console.error(err));
    
    })