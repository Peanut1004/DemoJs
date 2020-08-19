var main = document.querySelector('.main');
// Get homepage
const getHomePage = document.querySelector('.menu__sub--loadHomePage');

function loadHomePage() {
	fetch("home-content.html")
		.then(function(response) {
			response.text().then(function(html) {
				main.innerHTML = html;
				numMiniCart();
			});
		})
}
getHomePage.onclick = function(){
	loadHomePage();
};
window.onload = function(){
	loadHomePage();
};

// Load page products
const getMenuProducts = document.querySelector('.menu__sub--loadProduct');

function loadPageProduct() {
  fetch("shop-grid-sidebar.html")
  	.then(function(response) {
      response.text().then(function(html) {
	      main.innerHTML = html;
	      var listItems = document.querySelector('.shop-grid__columns');
	      fetch('http://localhost:3000/products')
	      	.then(function(res){
	      		if (res.status !== 200) {
			        console.log('Lỗi, mã lỗi ' + res.status);
			        return;
			      }
			      res.json().then(function(item){
			      	var itemBox = '';
			      	for(var i in item) {
			      		itemBox += '<div class="product-grid__box"><div class="product-grid__img"><a href="#"><img src="' + item[i].image + '" alt="images"></a><span class="product-grid__label--"></span><div class="product-grid__overlay"></div><div class="product-grid__link"><a class="btn__common" product-id="'+ item[i].id +'">mua ngay</a><a class="btn__search" href="#"><i class="fa fa-search"></i></a></div></div><div class="product-grid__content"><h3 class="product-grid__name"><a href="#">'+ item[i].name +'</a></h3><div class="product-grid__evaluate"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-half-o" aria-hidden="true"></i></div><div class="product-grid__price"><span class="new-price">'+ item[i].nprice +'</span><span class="old-price">'+ item[i].oprice +'</span></div></div></div>';
			      		i++;
			      	}
			      	listItems.innerHTML = itemBox;
			      	const clickButton = document.querySelectorAll(".product-grid__box .btn__common");
			      	clickButton.forEach(function(element){
			      		element.onclick = function(){
			      			// add class loading
			      			element.setAttribute('class','btn__common loading');
			      			setTimeout(() => {
			      				addToCart(element.getAttribute('product-id'));
			      				element.setAttribute('class','btn__common added');
			      			}, 500)
			      		}
			      	});
			      })
	      	})
	    });
    })
 	
}
getMenuProducts.onclick = function(){
	loadPageProduct();
};

// Add to cart
function addToCart(id) {
  	if (typeof(Storage) !== 'undefined') {
		var keys = Object.keys(localStorage),
			i = keys.length;
			if (i !== 0) {
				if (!localStorage.hasOwnProperty(id)) {
					addNewProduct(id);
				}else{
					updateProduct(id);
				}
			}else{
				addNewProduct(id);
			}
		numMiniCart();
	}
}
function updateProduct(id) {
  var getIdUpdate = JSON.parse(localStorage.getItem(id));	
  localStorage.setItem(id,JSON.stringify({ qty: getIdUpdate.qty + 1 }));
}
function addNewProduct(id) {
  localStorage.setItem(id, JSON.stringify({ qty: 1 }));
}
//Mini cart on header
function numMiniCart(){
	var num = document.querySelector('.header__cart--amount'),
		curentNum = 0,
		keys = Object.keys(localStorage);

		keys.forEach(function(index){
  			curentNum += JSON.parse(localStorage.getItem(index)).qty;
		})
      
      num.innerHTML = curentNum + " Sản phẩm";
}

// cart
var getPageCart = document.querySelector('.header__cart');

function pageCart(){
	fetch("shop-cart.html")
		.then(function(response){
			console.log(response);
			return response.text();
		})
		.then(function(html){
			console.log(html);
			main.innerHTML = html;
			var clearAll = document.querySelector('.btn__clearAll'),
					ctBuy = document.querySelector('.btn__ctBuy'),
					getPageCheckout = document.querySelector('.cart__btn--checkout');
			loadListProductInCart();
			numMiniCart();
			// ClearAll Product in page 
			clearAll.onclick = function() {
				clearAllCart();
			}
			ctBuy.onclick = function() {
				loadPageProduct();
			}
			getPageCheckout.onclick = function() {
				var checkListCart = Object.keys(localStorage);
				if (checkListCart.length !== 0) {
					checkoutCart();
				}else{
					alert('Vui lòng chọn sản phẩm trước khi thanh toán');
				}
			}
		})

}
function clearAllCart() {
	if(confirm('Bạn có muốn xóa tất cả không?')) {
		localStorage.clear();
		pageCart();
	}
}
getPageCart.onclick = function() {
	pageCart();
}

// load list product in cart
function loadListProductInCart() {
	var getItemProduct = document.querySelector('.cart__product');
	var keys = Object.keys(localStorage),
				listProducts = {};
		for(let i = 0 ; i < keys.length ; i++){
			var id = keys[i],
					qty = JSON.parse(localStorage.getItem(keys[i])).qty;
			listProducts[i] = JSON.stringify({id, qty}) ;
		}
		fetch("http://localhost:3000/products")
		.then(function(res){
	  		if (res.status !== 200) {
	        console.log('Lỗi, mã lỗi ' + res.status);
	        return;
	      }
	      res.json().then(function(item){
	      	var itemProduct = '';
	      	for(var i in listProducts) {
	      		var idCheck = JSON.parse(listProducts[i]).id,
	      				qty = JSON.parse(listProducts[i]).qty;
	      		itemProduct += '<tr><td class="cart__product--img" data-title="hình ảnh"><a href="#"><img src="'+ item[idCheck - 1 ].image +'" alt="images"></a></td><td class="cart__product--name" data-title="tên sản phẩm"><a href="#">'+ item[idCheck - 1 ].name +'</a></td><td class="cart__product--price" data-title="đơn giá"><span class="unit-amount">$'+ item[idCheck - 1 ].nprice +'</span></td><td class="cart__product--quantity" data-title="số lượng"><span class="input-counter">'+  qty +'</span></td><td class="cart__product--total" data-title="thành tiền"><span class="subtotal-amount">$'+ item[idCheck - 1 ].nprice * qty +'</span></td><td class="cart__product--remove" remove-id="'+ idCheck +'"><a href="#"><i class="fa fa fa-trash"></i></a></td></tr>';
	      		i++;
	      	}
	      	getItemProduct.innerHTML = itemProduct;

	      	const getElementRemove = document.querySelectorAll("tr .cart__product--remove");
		      	getElementRemove.forEach(function(element){
		      		element.onclick = function(){
		      			removeCartItem(element.getAttribute('remove-id'));
		      		}
		      	});
	      	const clickButton = document.querySelectorAll("tr .cart__product--total .subtotal-amount");
	      	var getElementsum = document.querySelector(".cart__pay tr .ttprice");
	      		var sum = 0;
		      	clickButton.forEach(function(element){
		      		sum += parseInt(element.textContent.slice(1)) ;
		      	});
		      	getElementsum.innerHTML = '$'+sum;
	      })
	    })
}
function removeCartItem(id){
	if (confirm('Bạn muốn xóa sản phẩm?')) {
  	localStorage.removeItem(id);
  	pageCart();
	}
}

// Thông tin thanh toán đơn hàng
function checkoutCart(){
	fetch("checkout.html")
		.then(function(response){
			return response.text();
		})
		.then(function(html){
			main.innerHTML = html;
			var getFormInfor = document.querySelector('.form-wrap');
			fetch("http://localhost:3000/users")
				.then(function(res){
			  		if (res.status !== 200) {
			        console.log('Lỗi, mã lỗi ' + res.status);
			        return;
			      }
			      res.json().then(function(item){
			      	var inforUser = '';
			      	inforUser = '<fieldset class="form__group"><label>Họ và tên</label><input type="text" name="username" value="'+ item[0].lname +" "+ item[0].fname +'" required></fieldset><fieldset class="form__group"><label>Postal Code</label><input type="text" name="postal-code" value="'+ item[0].zip +'" required></fieldset><fieldset class="form__group"><label>Số điện thoại</label><input type="text" name="phone" value="'+ item[0].phone +'" required></fieldset><fieldset class="form__group"><label>Địa chỉ</label><input type="text" name="address" value="'+ item[0].address +'" required></fieldset><fieldset class="form__group"><label>Thành phố</label><input type="text" name="city" value="'+ item[0].city +'" required></fieldset>';
			      	getFormInfor.innerHTML = inforUser ;
			      })
			})
			var keys = Object.keys(localStorage),
				listProducts = {};
				for(let i = 0 ; i < keys.length ; i++){
					var id = keys[i],
							qty = JSON.parse(localStorage.getItem(keys[i])).qty;
					listProducts[i] = JSON.stringify({id, qty}) ;
				}
				fetch("http://localhost:3000/products")
				.then(function(res){
			  		if (res.status !== 200) {
			        console.log('Lỗi, mã lỗi ' + res.status);
			        return;
			      }
			      res.json().then(function(item){
			      	var itemProduct = '',
			      	    getFormOrder = document.querySelector('.your-order-middle ul'),
			      	    orderTotal =  document.querySelector('.order-total span');
			      	for(var i in listProducts) {
			      		var idCheck = JSON.parse(listProducts[i]).id,
			      				qty = JSON.parse(listProducts[i]).qty;
			      		itemProduct += '<li class="item-order">'+ item[idCheck - 1 ].name +' X '+ qty +' <span>$'+ item[idCheck - 1 ].nprice +'</span></li>';
			      		i++;
			      	}
			      	getFormOrder.innerHTML = itemProduct;
			      	var getElementsum = document.querySelectorAll('li.item-order span');
		      		var sumPriceOrder = 0;
			      	getElementsum.forEach(function(element){
			      		sumPriceOrder += parseInt(element.textContent.slice(1)) ;
			      	});
			      	orderTotal.innerHTML = '$'+sumPriceOrder;
			     })
			 })
			var checkoutProcess = document.querySelector('.checkout-process');
			checkoutProcess.onclick = function() {
				loadPageSuccessOrder();
			}
		})
}

// checkout thành công
function loadPageSuccessOrder(){
	fetch("order-success.html")
		.then(function(response){
			return response.text();
		})
		.then(function(html){
			main.innerHTML = html;
			localStorage.clear();
			numMiniCart();
		})
}