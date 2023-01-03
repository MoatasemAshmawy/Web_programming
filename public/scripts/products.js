const allcards = document.querySelector('.all_cards');

window.onload = fetchProducts;

async function fetchProducts(){
   let html = '';
   let response = await fetch('/getproducts');
	let products = await response.json();
   console.log(products);
   for(let i = 0;i<products.length;i++){
	console.log(products[i]);
    html+= `<a class="card" href="#">
                    <span class='product_id' style="display:none;">${products[i].Product_Id}</span>
					<div class="imgBox">
						<img src="./assets/images/${products[i].Product_Img}">
					</div>
					<div class="details">
						<div class="textContent">
							<h3>${products[i].Product_Name}</h3>
							<div class="price">${products[i].Product_Price}LE</div>
						</div>
			
						<button>Add To Cart</button>
					</div>
					<div class="description">
						<div class="icon"><i class="fas fa-info-circle"></i></div>
						<div class="contents">
							<h2>Description</h2>
							<p>${products[i].Product_Desc}</p>
						</div>
					</div>
				</a>`;
   }

   allcards.innerHTML = html;
}