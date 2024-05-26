const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

let cart = [];

// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// UI or display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `<article class="product">
                            <div class="img-container">
                                <img src=${product.image} alt="product" class="product-img">
                                <button class="bag-btn" data-id=${product.id}>
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    add to bag
                                </button>
                            </div>
                            <h3>${product.title}</h3>
                            <h4>$${product.price}</h4>
                        </article>`;
        });
        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }
            button.addEventListener("click", (e) => {
                e.target.innerText = "In Cart";
                e.target.disabled = true;

                // get product from products
                let cartItem = { ...Storage.getProduct(id), amount: 1 };

                // add product to the cart
                cart = [...cart, cartItem];

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValues(cart);

                // add cart item to the UI
                this.addCartItem(cartItem);

                // show the cart
                this.showCart();
            });
        });
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product">
                        <div>
                            <h4>${item.title}</h4>
                            <h5>$${item.price}</h5>
                            <span class="remove-item" data-id=${item.id}>remove</span>
                        </div>
                        <div>
                            <i class="fa-solid fa-chevron-up" data-id=${item.id}></i>
                            <p class="item-amount">${item.amount}</p>
                            <i class="fa-solid fa-chevron-down" data-id=${item.id}></i>
                        </div>`;
        cartContent.appendChild(div);

        // Add event listeners for the remove, increase, and decrease buttons
        div.querySelector('.remove-item').addEventListener('click', () => {
            this.removeItem(item.id);
            cartContent.removeChild(div);
        });
        div.querySelector('.fa-chevron-up').addEventListener('click', () => {
            this.increaseItemAmount(item.id);
            div.querySelector('.item-amount').innerText = item.amount;
        });
        div.querySelector('.fa-chevron-down').addEventListener('click', () => {
            this.decreaseItemAmount(item.id, div);
        });
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart.bind(this));
        closeCartBtn.addEventListener('click', this.hideCart.bind(this));
        clearCartBtn.addEventListener('click', this.clearCart.bind(this)); // Add clear cart event listener
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        const button = this.getSingleButton(id);
        if (button) {
            button.disabled = false;
            button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>add to bag`;
        }
    }

    increaseItemAmount(id) {
        let item = cart.find(item => item.id === id);
        item.amount++;
        this.setCartValues(cart);
        Storage.saveCart(cart);
    }

    decreaseItemAmount(id, div) {
        let item = cart.find(item => item.id === id);
        item.amount--;
        if (item.amount > 0) {
            this.setCartValues(cart);
            Storage.saveCart(cart);
            div.querySelector('.item-amount').innerText = item.amount;
        } else {
            this.removeItem(id);
            cartContent.removeChild(div);
        }
    }

    clearCart() {
        const cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    getSingleButton(id) {
        return document.querySelector(`.bag-btn[data-id="${id}"]`);
    }
}

// Actual Local storage class
class Storage {
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // setup application
    ui.setupAPP();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });
});