import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');

const urlExcursions = 'http://localhost:3000/excursions';
const urlOrders = 'http://localhost:3000/orders';

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    loadExcursions();
    loadOrders();
    addOrders();
    removeOrders();
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

function loadOrders() {
    fetch(urlOrders)
        .then(resp => {
            if(resp.ok) { return resp.json() }
            return Promise.reject(resp);
        })
        .then(data => {
            console.log(data);
            showOrders(data);
            updateTotalPrice(data);
        })
        .catch(err => console.error(err));
}

function addOrders() {
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

        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        fetch(urlOrders, options)
            .then(resp => console.log(resp))
            .catch(err => console.error(err))
            .finally(loadOrders);
        
        const formElList = e.target.elements;
        console.log(formElList)
        formElList[0].value = ''
        formElList[1].value = ''
    }) 
}

function showOrders(ordersArr) {
    console.log(ordersArr)

    const ulEl = document.querySelector('.panel__summary');
    const liPrototype = ulEl.querySelector('.summary__item--prototype');
    const liList = ulEl.querySelectorAll('.summary__item');
    console.log(liList)
    const liListArr = Array.prototype.slice.call(liList);
    liListArr.splice(0, 1);
    console.log(liListArr)
    liListArr.forEach(item => ulEl.removeChild(item));

    ordersArr.forEach(item => {
        const liEl = liPrototype.cloneNode(true);
        liEl.classList.remove('summary__item--prototype');
           
        const liTitle = liEl.querySelector('.summary__name');
        const liTotalPrice = liEl.querySelector('.summay__total-price');
        const liSummaryPrices = liEl.querySelector('.summary__prices')
    
        liTitle.innerText = item.title;
        liTotalPrice.innerText = `${item.totalPrice}PLN` 
        liSummaryPrices.innerText = `dorośli: ${item.adultNumber} x ${item.adultPrice}PLN, dzieci: ${item.childNumber} x ${item.childPrice}PLN`
        liEl.dataset.id = item.id;
    
        ulEl.appendChild(liEl)               
        
        //const formEl = document.querySelector('.form');
        //const formFields = formEl.querySelectorAll('.form__field');
        //console.log(formFields);
        //formFields.forEach(field => field.value = '');
    })
}

function removeOrders() {
    const ulEl = document.querySelector('.panel__summary');
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        console.log(e.currentTarget)
        const targetEl = e.target;
        const liEl = targetEl.parentElement.parentElement
        console.log(targetEl)
        console.log(liEl)

        const id = liEl.dataset.id;
        console.log(id)
        const options = { method: 'DELETE' };
        if(targetEl.innerText === 'X') {
            fetch(`${urlOrders}/${id}`, options)
                .then(resp => console.log(resp))
                .catch(err => console.error(err))
                .finally(loadOrders);
        }       
    })
}   

function updateTotalPrice(ordersArr) {
    const totalPriceValue = document.querySelector('.order__total-price-value')

    let sum = 0;
    ordersArr.forEach(item => {
        sum = sum + item.totalPrice;
    })
    
    totalPriceValue.innerText = `${sum}PLN`
}