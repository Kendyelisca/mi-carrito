
const carToggle = document.querySelector(".car__toggle");
const carBlock = document.querySelector(".car__block");
const baseURL = "https://academlo-api-production.up.railway.app/api"
const productsList = document.querySelector("#products-container")
const car = document.querySelector('#car');
const carList = document.querySelector('#car__list');
const emptyCarButton = document.querySelector('#empty__car')
let carProducts = [];


carToggle.addEventListener("click", () => {
    carBlock.classList.toggle("nav__car__visible")
})

eventListenersLoader()

function eventListenersLoader(){

    productsList.addEventListener('click', addProduct);

    car.addEventListener('click', deleteProduct);

    emptyCarButton.addEventListener('click', emptyCar)

    document.addEventListener('DOMContentLoaded', () => {
        carProducts = JSON.parse(localStorage.getItem('car')) || [];
        carElementsHTML();
    })
}

function getProducts() {
    axios.get(`${baseURL}/products`)
        .then(function(response){
            const products = response.data
            printProducts(products)
        })
        .catch(function (error){
            console.log(error)
        })
};
getProducts()


function printProducts(products) {
    let html = '';
    for(let i = 0; i < products.length; i++){
        html += `
        <div class="product__container">
            <div class="product__container__img">
                <img src="${products[i].images.image1}" alt="">
            </div>
            <div class="product__container__name">
                <p>${products[i].name}</p>
            </div>
            <div class="product__container__price">
                <p>$ ${products[i].price.toFixed(2)}</p>
            </div>
            <div class="product__container__button">
                <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>
            </div>
        </div>
        `
    }
    productsList.innerHTML = html;
}


function addProduct(e) {
    if(e.target.classList.contains('add__to__car')){
        const product = e.target.parentElement.parentElement
        carProductsElements(product)
    }
}

function carProductsElements(product) {
    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('.product__container__name p').textContent,
        price: product.querySelector('.product__container__price p').textContent,
        quantity: 1
    }
    

    if(carProducts.some(product => product.id === infoProduct.id)){
        const product = carProducts.map(product => {
            if(product.id === infoProduct.id) {
                product.quantity ++;
                return product;
            } else {
                return product;
            }
        })
        carProducts = [...product]

    } else {
        carProducts = [...carProducts, infoProduct]
    }

    carElementsHTML()
}

function carElementsHTML() {

    
    carList.innerHTML = "";

    carProducts.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="car__product">
            <div class="car__product__image">
                <img src="${product.image}" alt="">
            </div>
            <div class="car__product__description">
                <div>
                    <p>${product.name}</p>
                </div>
                <div>
                    <p>Precio: ${product.price}</p>
                </div>
                <div>
                    <p>Cantidad: ${product.quantity}</p>
                </div>
                <div class="car__product__button">
                    <button class="delete__product" data-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
        <hr>
        `;
        carList.appendChild(div)
    })

    productsStorage()
}

function productsStorage(){
    localStorage.setItem('car', JSON.stringify(carProducts))
}

function deleteProduct(e){
    if(e.target.classList.contains('delete__product')){
        const productId = e.target.getAttribute('data-id');
        carProducts = carProducts.filter(product => product.id !== productId);
        carElementsHTML();
    }
}

function emptyCar(){
    carList.innerHTML = "";
    carProducts = [];
}

