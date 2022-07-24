import './../css/reset.css';
import './../css/global.css';
import './../css/mobile.css';
import './../css/tablet.css';
import './../css/desktop.css';

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