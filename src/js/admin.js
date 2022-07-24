//import './../css/admin.css';
import './../css/reset.css';
import './../css/global.css';
import './../css/mobile.css';
import './../css/tablet.css';
import './../css/desktop.css';

import { loadExcursions, addExcursions, removeExcursions, updateExcursions } from './modules/excursions'

console.log('admin');

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    loadExcursions();
    addExcursions();
    removeExcursions();
    updateExcursions();
}