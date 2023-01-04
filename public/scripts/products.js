const allcards = document.querySelector('.all_cards');

window.onload = fetchProducts;

async function fetchProducts(){
   let html = '';
   let response = await fetch('/getproducts');
	let products = await response.json();
//    console.log(products);
   for(let i = 0;i<products.length;i++){
	console.log(products[i]);
    html+= `<div class="card" href="#">
					<div class="imgBox">
					
						<img src="./assets/images/${products[i].Product_Img}">
					</div>
					<div class="details">
						<div class="textContent">
							<h3 class='product_name'>${products[i].Product_Name}</h3>
							<div class="price">${products[i].Product_Price}LE</div>
						</div>
						<span class='product_id' style="display:none;">${products[i].Product_Id}</span>
						<button onclick='addincart(this)' class='add_to_cart_btn'>Add To Cart</button>
					</div>
					<div class="description">
						<div class="icon"><i class="fas fa-info-circle"></i></div>
						<div class="contents">
							<h2>Description</h2>
							<p class='product_desc'>${products[i].Product_Desc}</p>
						</div>
					</div>
				</div>`;
   }

   allcards.innerHTML = html;
}

// const product_id = document.querySelectorAll('.product_id');
// const add_btn = document.querySelectorAll('.add_to_cart_btn');

// for(let i=0;i<add_btn.length;i++){
// 	add_btn[i].addEventListener('click', addincart)
// }


async function addincart(obj){
	
	
	
	let response = await fetch('/addtocart', {
         
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