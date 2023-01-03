const login_submit = document.querySelector('#login_submit');
const login_form = document.querySelector('.admin_login_form');
const username = document.querySelector('#username');
const password = document.querySelector('#password')
login_form.addEventListener('submit',(e)=>{

e.preventDefault();

fetch('/auth/admin', {
     
    // Adding method type
    method: "POST",
    redirect: 'follow', 
    // Adding body or contents to send
    body: JSON.stringify({
        username: username.value,
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
        window.location.href ="/adminpage";
    }
    else{
        let h1 = document.createElement('h1');
        h1.innerHTML = 'Please Enter Valid Credentials';
        login_form.append(h1);
    }
})
 .catch(err =>console.error(err));

})