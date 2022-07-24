import ExcursionsAPI from '../ExcursionsAPI';

import { clearUl, clearFormFields, findUl, isMediaMobile } from './helper'
import { validateExcursionsForm, validateOrderForm, showErrors, clearErrorsMessages } from './validation'
import { toggleAddingItem, toggleRemovingItem, toggleSubmit } from './toggle';

const api = new ExcursionsAPI();

export function addItemToBasket(basket) {
    const ulEl = findUl('.panel__excursions');
    ulEl.addEventListener('submit', function(e) {
        e.preventDefault()        

        const targetEl= e.target;
                
        const data = createItemData(targetEl);

        clearErrorsMessages()
        let errors = []
        errors = validateExcursionsForm(targetEl, data)
        
        const excursionTitle = data.title
        const excursionIsInSummary = basket.findIndex(item => {
            return item.title === excursionTitle;
        });   
        
        const [adultNr, childNr] = targetEl.elements
        const fieldsToClear = [adultNr, childNr] 
        
        if(excursionIsInSummary >= 0) {
            alert('Masz już tę wycieczkę w swoim zamówieniu. Proszę wybrać inną.')
            clearFormFields(fieldsToClear);
        } else if(errors.length > 0) {
            showErrors(errors)
        } else {
            basket.push(data);
            showBasket(basket);   
            clearFormFields(fieldsToClear);           
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

    const isMobile = isMediaMobile()
    if(isMobile) {
        const toggler = document.querySelector('.hamburger') 
        toggleAddingItem(toggler, ulEl)
    }
}

export function removeItemFromBasket(basket) {
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

        const isMobile = isMediaMobile()
        if(isMobile) {
            toggleRemovingItem(ulEl)
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

export function submitOrder(basket) {
    const formEl = document.querySelector('.panel__order')
    formEl.addEventListener('submit', function(e) {
        e.preventDefault()
                
        const totalPrice = formEl.querySelector('.order__total-price-value');
        const items = basket;
        const targetEl = e.target;
        const order = createOrderData(formEl, targetEl, totalPrice, items);
        
        clearErrorsMessages()
        let errors = []
        errors = validateOrderForm(targetEl, order)
        
        const [name, email] = targetEl.elements
        const fieldsToClear = [name, email] 

        if(totalPrice.innerText === "0") {
            alert('Nie dodałeś/aś żadnej wycieczki do listy zamówień.')
            clearFormFields(fieldsToClear);
        } else if(errors.length > 0) {
            showErrors(errors)
        } else {
            alert(`Dziękujemy za złożenie zamówienia o wartości ${order.totalPrice}PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: ${order.email}.`)

            api.addOrders(order)
                .catch(err => console.error(err))
    
            clearFormFields(fieldsToClear);
            clearBasket(items);
            showBasket(items);
            
            const isMobile = isMediaMobile()
            if(isMobile) {
                const panelOrder = document.querySelector('.panel__order')
                const panelSummary = document.querySelector('.summary')
                toggleSubmit(panelOrder, panelSummary)
            }
        } 
    })   
}

function createOrderLi(item, liPrototype) {
    const liEl = liPrototype.cloneNode(true);
    liEl.classList.remove('summary__item--prototype');
           
    const liTitle = liEl.querySelector('.summary__name');
    const liTotalPrice = liEl.querySelector('.summary__total-price');
    const liSummaryPrices = liEl.querySelector('.summary__prices');
    
    liTitle.innerText = item.title;
    liTotalPrice.innerText = item.totalPrice 
    liSummaryPrices.innerText = `dorośli: ${item.adultNumber} x ${item.adultPrice}PLN, \ndzieci: ${item.childNumber} x ${item.childPrice}PLN`
    liEl.dataset.id = item.id;

    return liEl;
}

function createItemData(targetEl) {
    const liEl = targetEl.parentElement;
    const liTitle = liEl.querySelector('.excursions__title');
    const liPrice = liEl.querySelectorAll('.excursions__price');
    const [liAdultPrice, liChildPrice] = liPrice
    //const liAdultPrice = liPrice[0];
    //const liChildPrice = liPrice[1];
    const adultPrice = liAdultPrice.innerText;
    const childPrice = liChildPrice.innerText;
    
    const {adults, children} = targetEl.elements;

    return {
        title: liTitle.innerText,  
        totalPrice: Number((adults.value*adultPrice) + (children.value*childPrice)),
        adultNumber: Number(adults.value),
        adultPrice: Number(adultPrice),
        childNumber: Number(children.value),
        childPrice: Number(childPrice),
    }
}

function createOrderData(formEl, targetEl, totalPrice, items) {    
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const {name, email} = targetEl.elements;

    return {
        name: name.value,  
        email: email.value,
        totalPrice: Number(totalPrice.innerText),
        date: date,
        time: time,
        items: items,
    }
}

function clearBasket(basket) {
    basket.length = 0;
    return basket;
}