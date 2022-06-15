import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');

const urlExcursions = 'http://localhost:3000/excursions';
const urlOrders = 'http://localhost:3000/orders';

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    loadExcursions();

    const basket = []
    addItemToBasket(basket);    
    removeItemFromBasket(basket); 

    submitOrder(basket);
}

function loadExcursions() {
    fetch(urlExcursions)
        .then(resp => {
            if(resp.ok) { return resp.json() }
            return Promise.reject(resp);
        })
        .then(data => {
            console.log(data);
            showExcursions(data);
        })
        .catch(err => console.error(err));
}

function showExcursions(excursionsArr) {
    console.log(excursionsArr)
    const ulEl = document.querySelector('.panel__excursions');
    const liPrototype = ulEl.querySelector('.excursions__item--prototype');
    //const liList = ulEl.querySelectorAll('.excursions__item');
    //console.log(liList)
    //const liListArr = Array.prototype.slice.call(liList);
    //liListArr.splice(0, 1);
    //console.log(liListArr)
    //liListArr.forEach(item => ulEl.removeChild(item));

    excursionsArr.forEach(item => {
        const liEl = liPrototype.cloneNode(true);
        liEl.classList.remove('excursions__item--prototype');
    
        const liTitle = liEl.querySelector('.excursions__title');
        const liDescription = liEl.querySelector('.excursions__description');
        const liPrice = liEl.querySelectorAll('.excursions__price');
        const liAdultPrice = liPrice[0];
        const liChildPrice = liPrice[1];
    
        liTitle.innerText = item.title;
        liDescription.innerText = item.description;
        liAdultPrice.innerText = item.adultPrice;
        liChildPrice.innerText = item.childPrice;
        liEl.dataset.id = item.id;
    
        ulEl.appendChild(liEl)               
        
        //const formEl = document.querySelector('.form');
        //const formFields = formEl.querySelectorAll('.//form__field');
        //console.log(formFields);
        //formFields.forEach(field => field.value = '');
    })
}

function addItemToBasket(basket) {
    const ulEl = document.querySelector('.panel__excursions');
    ulEl.addEventListener('submit', function(e) {
        e.preventDefault()        

        const liEl = e.target.parentElement;
        const liTitle = liEl.querySelector('.excursions__title');
        const liPrice = liEl.querySelectorAll('.excursions__price');
        const liAdultPrice = liPrice[0];
        const liChildPrice = liPrice[1];
        const adultPrice = liAdultPrice.innerText;
        const childPrice = liChildPrice.innerText;
        //liEl.dataset.id = item.id;

        console.log(e.target)
        console.log(e.currentTarget)

        console.log(e.target.elements)
        const {adults, children} = e.target.elements;
        
        const data = {
            title: liTitle.innerText,  
            totalPrice: (adults.value*adultPrice) + (children.value*childPrice),
            adultNumber: adults.value,
            adultPrice: adultPrice,
            childNumber: children.value,
            childPrice: childPrice,
        }
        console.log(data)
        
        const formElList = e.target.elements;
        console.log(formElList)
        formElList[0].value = ''
        formElList[1].value = ''

        basket.push(data);
        showBasket(basket);
    }) 
}

function showBasket(basket) {
    console.log(basket)

    const ulEl = document.querySelector('.panel__summary');
    const liPrototype = ulEl.querySelector('.summary__item--prototype');
    
    const liList = ulEl.querySelectorAll('.summary__item');
    console.log(liList)
    const liListArr = Array.prototype.slice.call(liList);
    liListArr.splice(0, 1);
    console.log(liListArr)
    liListArr.forEach(item => ulEl.removeChild(item));

    basket.forEach(item => {
        const liEl = liPrototype.cloneNode(true);
        liEl.classList.remove('summary__item--prototype');
           
        const liTitle = liEl.querySelector('.summary__name');
        const liTotalPrice = liEl.querySelector('.summary__total-price');
        const liSummaryPrices = liEl.querySelector('.summary__prices');
    
        liTitle.innerText = item.title;
        liTotalPrice.innerText = item.totalPrice 
        liSummaryPrices.innerText = `dorośli: ${item.adultNumber} x ${item.adultPrice}PLN, dzieci: ${item.childNumber} x ${item.childPrice}PLN`
        liEl.dataset.id = item.id;
    
        ulEl.appendChild(liEl) 
  
    })            
    
    updateTotalPrice(basket);
        
        //const formEl = document.querySelector('.form');
        //const formFields = formEl.querySelectorAll('.form__field');
        //console.log(formFields);
        //formFields.forEach(field => field.value = '');
    //})
}

function removeItemFromBasket(basket) {
    const ulEl = document.querySelector('.panel__summary');
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        console.log(e.currentTarget) //ul
        const targetEl = e.target;
        const liEl = targetEl.parentElement.parentElement
        const excursionTitleEl = liEl.querySelector('.summary__name');
        const excursionTitle = excursionTitleEl.innerText
        console.log(excursionTitle)
        console.log(targetEl) //a
        console.log(liEl) //li

        const index = basket.findIndex(item => {
            return item.title === excursionTitle;
        });            
        console.log(index)

        if(targetEl.innerText === 'X') {
            basket.splice(index, 1);
            console.log(basket);
            showBasket(basket);
        }       
    })
}   

function updateTotalPrice(basket) {
    let sum = 0;

    basket.forEach(item => {
        const itemPrice = item.totalPrice;
        sum = sum + itemPrice;
    })
        
    const totalPriceValue = document.querySelector('.order__total-price-value')
    totalPriceValue.innerText = sum
    return sum;
}

function submitOrder(basket) {
    const formEl = document.querySelector('.panel__order')
    formEl.addEventListener('submit', function(e) {
        e.preventDefault()
                
        const totalPrice = formEl.querySelector('.order__total-price-value');
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const items = basket;
        console.log(items);
        
        console.log(e.target) //form
        console.log(e.currentTarget) //form

        console.log(e.target.elements)
        const {name, email} = e.target.elements;

        const order = {
            name: name.value,  
            email: email.value,
            totalPrice: totalPrice.innerText,
            date: date,
            time: time,
            items: items,
        }
        console.log(order)
        
        //clearErrorsMessage()
        //let errors = []
        //errors = checkOrderFormData(inputName, inputEmail, //inputNameEl, inputEmailEl)
        
        if(totalPrice.innerText === "0") {
            alert('Nie dodałeś/aś żadnej wycieczki do listy zamówień.')
        //} else if(errors.length > 0) {
            //showErrorsMessage(errors)
        } else {
            alert(`Dziękujemy za złożenie zamówienia o wartości ${order.totalPrice}PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: ${order.email}.`)

            const options = {
                method: 'POST',
                body: JSON.stringify(order),
                headers: {'Content-Type': 'application/json'}
            };
            fetch(urlOrders, options)
                .then(resp => console.log(resp))
                .catch(err => console.error(err))

            //clearContent()
            
            const formElList = e.target.elements;
            console.log(formElList)
            formElList[0].value = ''
            formElList[1].value = ''
        } 
    })   
}