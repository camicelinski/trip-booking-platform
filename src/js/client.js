import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');

const api = new ExcursionsAPI();

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
    api.loadExcursionsData()
        .then(data => {
            console.log(data);
            showExcursions(data);
        })
        .catch(err => console.error(err));
}

function showExcursions(excursionsList) {
    const ulEl = findUl('.panel__excursions');
    const liPrototype = ulEl.querySelector('.excursions__item--prototype');

    clearUl(ulEl);
    
    excursionsList.forEach(item => {
        const liEl = createExcursionLi(item, liPrototype);    
        ulEl.appendChild(liEl)                       
    })
}

function addItemToBasket(basket) {
    const ulEl = findUl('.panel__excursions');
    ulEl.addEventListener('submit', function(e) {
        e.preventDefault()        

        const targetEl= e.target;
                
        const data = createItemData(targetEl);

        clearErrors()
        let errors = []
        errors = validateExcursionsForm(targetEl.elements, data)
        
        const excursionTitle = data.title
        const excursionIsInSummary = basket.findIndex(item => {
            return item.title === excursionTitle;
        });      
        
        if(excursionIsInSummary >= 0) {
            alert('Masz już tę wycieczkę w swoim zamówieniu. Proszę wybrać inną.')
            clearFormFields(targetEl);
        } else if(errors.length > 0) {
            showErrors(errors)
        } else {
            basket.push(data);
            showBasket(basket);   
            clearFormFields(targetEl);
        }          
    }) 
}

function showBasket(basket) {
    const ulEl = findUl('.panel__summary');
    const liPrototype = ulEl.querySelector('.summary__item--prototype');
    
    clearUl(ulEl);

    basket.forEach(item => {
        const liEl = createOrderLi(item, liPrototype)    
        ulEl.appendChild(liEl)   
    })            
    
    updateTotalPrice(basket);
}

function removeItemFromBasket(basket) {
    const ulEl = findUl('.panel__summary');
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;
        const liEl = targetEl.parentElement.parentElement
        const excursionTitleEl = liEl.querySelector('.summary__name');
        const excursionTitle = excursionTitleEl.innerText

        const index = basket.findIndex(item => {
            return item.title === excursionTitle;
        });            

        if(targetEl.innerText === 'X') {
            basket.splice(index, 1);
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
        const items = basket;
        const targetEl = e.target;
        const order = createOrderData(formEl, targetEl, totalPrice, items);
        
        clearErrors()
        let errors = []
        errors = validateOrderForm(targetEl.elements, order)
        
        if(totalPrice.innerText === "0") {
            alert('Nie dodałeś/aś żadnej wycieczki do listy zamówień.')
            clearFormFields(targetEl);
        } else if(errors.length > 0) {
            showErrors(errors)
        } else {
            alert(`Dziękujemy za złożenie zamówienia o wartości ${order.totalPrice}PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: ${order.email}.`)

            api.addOrdersData(order)
                .catch(err => console.error(err))
    
            clearFormFields(targetEl);
            clearBasket(items);
            showBasket(items);
        } 
    })   
}

function Error(field, text) {
    this.field = field;
    this.text = text;
}

function validateExcursionsForm(fields, data) {
    const errors = [] 

    const adultField = fields[0];
    const childField = fields[1];

    const adultNumber = data.adultNumber
    const childNumber = data.childNumber

    const regNumber = /^[0-9]+$/

    if(!regNumber.test(adultNumber) || adultNumber < 0) {
        errors.push(new Error(adultField, 'Pole musi zawierać liczbę.'))
    } 
    if(!regNumber.test(childNumber) || childNumber < 0) {
        errors.push(new Error(childField, 'Pole musi zawierać liczbę.'))
    }
    if(adultNumber === 0 && childNumber === 0) {
        errors.push(new Error(childField, 'Co najmniej jedno z pol musi zawierać liczbę.'))
    }
    
    return errors
}

function validateOrderForm(fields, data) {
    const errors = [] 
    
    const nameField = fields[0];
    const emailField = fields[1];

    const name = data.name
    const email = data.email

    const regName = /^[a-zA-ZąćężźłóńśĄĆĘŻŹŁÓŃŚ \-]+$/;
    
    if(!regName.test(name)) {
        if(name.length === 0) {
            errors.push(new Error(nameField, 'Pole "Imię i nazwisko" jest wymagane.'))
        } else {
            errors.push(new Error(nameField, 'Pole imię i nazwisko może zawierać tylko litery i "-".'))
        }
    }
    
    if(!email.includes('@')) {
        if(email.length === 0) {
            errors.push(new Error(emailField, 'Pole "Email" jest wymagane.'))
        } else {
            errors.push(new Error(emailField, 'Email musi zawierać znak "@".'))
        }
    }     

    return errors
}

function showErrors(errors) {
    console.log(errors)
    errors.forEach(error => {
        const pEl = document.createElement('p')
        pEl.classList.add('error')
        const errorPreviousEl = error.field
        console.log(errorPreviousEl)
        pEl.innerText = error.text
        errorPreviousEl.after(pEl)
    })
}

function clearErrors() {
    const errorsMessages = document.querySelectorAll('.error')
    errorsMessages.forEach(message => {
        message.parentNode.removeChild(message)
    })
}

function createExcursionLi(item, liPrototype) {
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

    return liEl;
}

function createOrderLi(item, liPrototype) {
    const liEl = liPrototype.cloneNode(true);
    liEl.classList.remove('summary__item--prototype');
           
    const liTitle = liEl.querySelector('.summary__name');
    const liTotalPrice = liEl.querySelector('.summary__total-price');
    const liSummaryPrices = liEl.querySelector('.summary__prices');
    
    liTitle.innerText = item.title;
    liTotalPrice.innerText = item.totalPrice 
    liSummaryPrices.innerText = `dorośli: ${item.adultNumber} x ${item.adultPrice}PLN, dzieci: ${item.childNumber} x ${item.childPrice}PLN`
    liEl.dataset.id = item.id;

    return liEl;
}

function createItemData(targetEl) {
    const liEl = targetEl.parentElement;
    const liTitle = liEl.querySelector('.excursions__title');
    const liPrice = liEl.querySelectorAll('.excursions__price');
    const liAdultPrice = liPrice[0];
    const liChildPrice = liPrice[1];
    const adultPrice = liAdultPrice.innerText;
    const childPrice = liChildPrice.innerText;
    
    const {adults, children} = targetEl.elements;

    return {
        title: liTitle.innerText,  
        totalPrice: (adults.value*adultPrice) + (children.value*childPrice),
        adultNumber: Number(adults.value),
        adultPrice: adultPrice,
        childNumber: Number(children.value),
        childPrice: childPrice,
    }
}

function createOrderData(formEl, targetEl, totalPrice, items) {    
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const {name, email} = targetEl.elements;

    return {
        name: name.value,  
        email: email.value,
        totalPrice: totalPrice.innerText,
        date: date,
        time: time,
        items: items,
    }
}

function clearUl(ulEl) {
    const liList = ulEl.querySelectorAll('li');
    console.log(liList)
    const liListArr = Array.prototype.slice.call(liList);
    liListArr.splice(0, 1);
    console.log(liListArr)
    liListArr.forEach(item => ulEl.removeChild(item));
}

function clearFormFields(targetEl) {
    const formElList = targetEl.elements;
    console.log(formElList)
    formElList[0].value = ''
    formElList[1].value = ''
}

function clearBasket(basket) {
    basket.length = 0;
    return basket;
}

function findUl(selector) {
    return document.querySelector(selector)
}