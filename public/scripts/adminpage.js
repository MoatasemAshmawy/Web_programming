const dash_btn = document.querySelector('#dashboard');
const order_btn = document.querySelector('#orders');
const product_btn = document.querySelector('#products');

const dash_view = document.querySelector('.dashboard_view');;
const product_view = document.querySelector('.products_view');
const order_view = document.querySelector('.orders_view');

dash_btn.addEventListener("click",()=>{
    dash_view.style.display = "block";
    product_view.style.display = "none";
    order_view.style.display = "none";
    
});

order_btn.addEventListener("click",()=>{
    dash_view.style.display = "none";
    product_view.style.display = "none";
    order_view.style.display = "block";
});

product_btn.addEventListener("click",()=>{
    dash_view.style.display = "none";
    product_view.style.display = "block";
    order_view.style.display = "none";
});


