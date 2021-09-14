const productDOM = document.querySelector(".product__center");
const cartDOM = document.querySelector(".cart");
const cartContent = document.querySelector(".cart__centent");
const openCart = document.querySelector(".cart__icon");
const closeCart = document.querySelector(".close__cart");
const overlay = document.querySelector(".cart__overlay");
const cartTotal = document.querySelector(".cart__total");
const clearCartBtn = document.querySelector(".clear__cart");
const emptyCart = document.querySelector('.empty-cart');
const cartFooter = document.querySelector('.cart__footer');
const restoranDOM = document.querySelector('.restoran-container')


let cart = [];

let buttonDOM = [];

class UI {
  displayRestoran(restoran) {
    let results = "";
    results += `<div class="restoran">
                  <div class="restoran-main">
                    <div class="restoran-logo">
                      <img src="./assets/restoran-logo.svg"/>
                    </div>
                    <div class="restoran-info">
                      <h2 class="restoran-name">${restoran.DisplayName}</h2>
                      <h3 class="restoran-address">( ${restoran.AddressText})</h3>
                      <div class="restoran-votes">
                        <div class="restoran-vote-transparent">
                          <img src="./assets/super-teslimat.svg"/>
                        </div>
                        <div class="restoran-vote">
                          <span>Hiz</span>
                          <span class="vote">${restoran.Speed}</span>
                        </div>
                        <div class="restoran-vote">
                          <span>Servis</span>
                          <span class="vote">${restoran.Serving}</span>
                        </div>
                        <div class="restoran-vote">
                          <span>Lezzet</span>
                          <span class="vote">${restoran.Flavour}</span>
                        </div>
                        <div class="servis">
                          <img src="./assets/min-tutar.svg" class="servis-img"/>
                          <span>Min. Tutar</span>
                          <span class="servis-bold">${restoran.DeliveryFee} TL</span>
                        </div>
                        <div class="servis">
                          <img src="./assets/servis-suresi.svg" class="servis-img"/>
                          <span>Servis Suresi</span>
                          <span class="servis-bold">${restoran.DeliveryTime} dk.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                `

  

    restoranDOM.innerHTML = results;
  }

  displayProducts(menus) {
    let results = "";
    menus.forEach(menu => {
      results += `<div class="menu">
                    <h5>${menu.DisplayName}</h5>
                  </div>`
      const products = menu.Products;
        for(let i= 0; i < products.length ; i++) {
          results += `<!-- Single Product -->
          <div class="product">
            <div class="add-button">
              <button class="btn addToCart" data-id=${products[i].ProductId} >
                  <svg class="add-icon">
                    <use xlink:href="./assets/sprite.svg#icon-plus" color="#fff"></use>
                  </svg>
              </button>
            </div>
            <div class="product-info">
              <div class="product-header">
                <h5 class="product-name">${products[i].DisplayName}</h5>
                <p>${products[i].Description}</p>
              </div>
              <span class="price">${products[i].ListPrice} TL</span>
            </div>
          </div>
          <!-- End of Single Product -->`;
        }
    });

    productDOM.innerHTML = results;
  }

  getButtons() {
    const buttons = [...document.querySelectorAll(".addToCart")];
    buttonDOM = buttons;
    buttons.forEach(button => {
      const id = button.dataset.id;

      button.addEventListener("click", e => {
        e.preventDefault();

        // Get product from products
        const cartItem = { ...Storage.getProduct(id), amount: 1 };

        // Add product to cart
        cart = [...cart, cartItem];

        // save the cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setItemValues(cart);
        // display the cart item
        this.addCartItem(cartItem);
      });
    });
  }

  setItemValues(cart) {
    let tempTotal = 0;
    let itemTotal = 0;

    cart.map(item => {
      tempTotal += parseInt(item.ListPrice, 10) * item.amount;
      itemTotal += item.amount;
    });
    cartTotal.innerText = `${parseFloat(tempTotal.toFixed(2))} TL`;
  }

  addCartItem(cartItem) {
    console.log('cartItem', cartItem);
    const div = document.createElement("div");
    div.classList.add("cart__item");

    div.innerHTML = `
          <h4 class="cart-item-header">${cartItem.DisplayName}</h4>
          <p class="price">${cartItem.ListPrice} TL</p>
          <div class="cart-actions">
            <span class="increase" data-id=${cartItem.ProductId}>
              <svg>
                <use xlink:href="./assets/sprite.svg#icon-angle-up"></use>
              </svg>
            </span>
            <p class="item__amount">1</p>
            <span class="decrease" data-id=${cartItem.ProductId}>
              <svg>
                <use xlink:href="./assets/sprite.svg#icon-angle-down"></use>
              </svg>
            </span>
          </div>

            <span class="remove__item" data-id=${cartItem.ProductId}>
              <svg>
                <use xlink:href="./assets/sprite.svg#icon-cross"></use>
              </svg>
            </span>

        </div>`;
    cartContent.appendChild(div);
  }

  setAPP() {
    cart = Storage.getCart();
    this.setItemValues(cart);
    this.populate(cart);
  }

  populate(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cartLogic() {
    // Clear Cart
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // Cart Functionality
    cartContent.addEventListener("click", e => {
      const target = e.target.closest("span");
      const targetElement = target.classList.contains("remove__item");
      if (!target) return;

      if (targetElement) {
        const id = target.dataset.id;
        this.removeItem(id);
        cartContent.removeChild(target.parentElement);
      } else if (target.classList.contains("increase")) {
        const id = target.dataset.id;
        let tempItem = cart.find(item => item.ProductId === id);
        tempItem.amount++;
        Storage.saveCart(cart);
        this.setItemValues(cart);
        target.nextElementSibling.innerText = tempItem.amount;
      } else if (target.classList.contains("decrease")) {
        const id = target.dataset.id;
        let tempItem = cart.find(item => item.ProductId === id);
        tempItem.amount--;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setItemValues(cart);
          target.previousElementSibling.innerText = tempItem.amount;
        } else {
          this.removeItem(id);
          cartContent.removeChild(target.parentElement.parentElement);
        }
      }
    });
    /* console.log('cartContent', cartContent.childElementCount);
    if(cartContent.childElementCount === 0) {
      const emptyCartText = document.createElement("h3");
      const node = document.createTextNode("Sepetiniz henuz bos");
      emptyCartText.appendChild(node);
      cartFooter.appendChild(emptyCartText);
    } else {
      emptyCart.remove();
    } */
  }

  clearCart() {
    const cartItems = cart.map(item => item.ProductId);
    console.log('cartItems', cartItems);
    cartItems.forEach(id => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }

  removeItem(id) {
    cart = cart.filter(item => item.ProductId !== id);
    console.log('cart', cart);
    this.setItemValues(cart);
    Storage.saveCart(cart);
  }

  singleButton(id) {
    return buttonDOM.find(button => parseInt(button.dataset.id) === id);
  }
}

class Products {
  async getProducts() {
    try {
      const result = await fetch("menuData.json");
      const data = await result.json();
      const products = data.d.ResultSet;
      return products;
    } catch (err) {
      console.log(err);
    }
  }
}

class Restoran {
  async getRestoran() {
    try {
      const result = await fetch("restoranData.json");
      const data = await result.json();
      const restoran = data.d.ResultSet;
      return restoran;
    } catch (err) {
      console.log(err);
    }
  }
}

class Storage {
  static saveProduct(obj) {
    localStorage.setItem("products", JSON.stringify(obj));
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static saveRestoran(obj) {
    localStorage.setItem("restoran", JSON.stringify(obj));
  }

  static getProduct(id) {
    let products = [];
    const menus = JSON.parse(localStorage.getItem("products"))
    menus.forEach(menu => menu.Products.forEach(product => products.push(product)));
    return products.find(product => product.ProductId === id);
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const productList = new Products();
  const restoranInfo = new Restoran();
  const ui = new UI();

  ui.setAPP();

  const products = await productList.getProducts();
  ui.displayProducts(products);
  Storage.saveProduct(products);
  const restoran = await restoranInfo.getRestoran();
  ui.displayRestoran(restoran);
  Storage.saveRestoran(restoran);
  ui.getButtons();
  ui.cartLogic();
});
