import './../css/client.css';

import { loadExcursions } from './modules/excursions'
import { addItemToBasket, removeItemFromBasket, submitOrder } from './modules/basket'

console.log('client');

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    loadExcursions();

    const basket = []
    addItemToBasket(basket);    
    removeItemFromBasket(basket); 

    submitOrder(basket);
}

//admin
//function clearFormFields(formEl) {
//    const formFields = formEl.querySelectorAll('.form__field');
//    formFields.forEach(field => field.value = '');
//}

//client
//function clearFormFields(targetEl) {
//    const formElList = targetEl.elements;
//    formElList[0].value = ''
//    formElList[1].value = ''
//}
