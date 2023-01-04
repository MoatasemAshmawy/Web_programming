const shop = document.querySelector('.shop');

const total_price  = document.querySelector('#total_price')
const tax = document.querySelector('#tax')
const subtotal = document.querySelector('#subtotal')

window.onload = fetchCartProducts;

async function fetchCartProducts(){
   let html = '';
   let response = await fetch('/getcartproducts');
	let result = await response.json();
    let products = result.result;
    if(!result.login){
        html = '<h1>Please Login First</h1>';
        shop.innerHTML = html;
        return;
    }
    let sum = 0;
   console.log(products);
   for(let i = 0;i<products.length;i++){
	console.log(products[i]);
    sum+=products[i].Product_Price;
    html+=    `<div class="box">
                <img src="./assets/images/${products[i].Product_Img}" alt="">  
                <div class="content">
                    <h3>${products[i].Product_Name}</h3>
                    <h4>Price: ${products[i].Product_Price}LE</h4>
                    <p class="unit">Quantity: <input value="1"></p>
                    <p class="btn-area">
                        <i class="trash">
                            <span class='product_id' style="display:none;">${products[i].Product_Id}</span>
                            <button onclick='deletefromcart(this)' class="btn2">Remove</button>
                        </i>
                    </p>
                </div>
            </div>`;
   }
   

   subtotal.innerHTML = `${sum}LE`;
   tax.innerHTML = `${Math.round(sum*0.14)}LE`;
   total_price.innerHTML = `${Math.round(sum*1.14)}LE`;
   shop.innerHTML = html;
}


async function deletefromcart(obj){
    let response = await fetch('/deletefromcart', {
         
        // Adding method type
        method: "POST",
         
        // Adding body or contents to send
        body: JSON.stringify({
            product_id: obj.parentNode.querySelector('.product_id').textContent
           
        }),
         
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
     
	console.log(response);
}