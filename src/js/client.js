import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');

const api = new ExcursionsAPI();
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
    api.loadExcursionsData()
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

        console.log(e.target) //form
        console.log(e.currentTarget)

        console.log(e.target.elements)
        const {adults, children} = e.target.elements;
        
        const data = {
            title: liTitle.innerText,  
            totalPrice: (adults.value*adultPrice) + (children.value*childPrice),
            adultNumber: Number(adults.value),
            adultPrice: adultPrice,
            childNumber: Number(children.value),
            childPrice: childPrice,
        }
        console.log(data)

        clearErrors()
        let errors = []
        errors = validateExcursionsForm(e.target.elements, data)
        
        const excursionTitle = liTitle.innerText
        console.log(excursionTitle)
        const excursionIsInSummary = basket.findIndex(item => {
            return item.title === excursionTitle;
        });      
        console.log(excursionIsInSummary)
        
        if(excursionIsInSummary >= 0) {
            alert('Masz już tę wycieczkę w swoim zamówieniu. Proszę wybrać inną.')

            const formElList = e.target.elements;
            console.log(formElList)
            formElList[0].value = ''
            formElList[1].value = ''
        } else if(errors.length > 0) {
            showErrors(errors)
        } else {
            const formElList = e.target.elements;
            console.log(formElList)
            formElList[0].value = ''
            formElList[1].value = ''

            basket.push(data);
            showBasket(basket);            
        }          
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
        
        clearErrors()
        let errors = []
        errors = validateOrderForm(e.target.elements, order)
        
        if(totalPrice.innerText === "0") {
            alert('Nie dodałeś/aś żadnej wycieczki do listy zamówień.')

            const formElList = e.target.elements;
            console.log(formElList)
            formElList[0].value = ''
            formElList[1].value = ''
        } else if(errors.length > 0) {
            showErrors(errors)
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

            basket.length = 0;
            showBasket(basket);
        } 
    })   
}

function Error(field, text) {
    this.field = field;
    this.text = text;
}

function validateExcursionsForm(fields, data) {
    const errors = [] 

    console.log(fields)
    const adultField = fields[0];
    const childField = fields[1];

    const adultNumber = data.adultNumber
    console.log(adultNumber)
    const childNumber = data.childNumber
    console.log(childNumber)

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

    console.log(fields)
    const nameField = fields[0];
    const emailField = fields[1];

    const name = data.name
    console.log(name)
    const email = data.email
    console.log(email)

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