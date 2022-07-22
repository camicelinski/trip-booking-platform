import './../css/admin.css';

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