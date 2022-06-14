import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');

const urlExcursions = 'http://localost:3000/excursions';

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    loadExcursions();
}

function loadExcursions() {
    fetch(urlExcursions)
        .then(resp => {
            if(resp.ok) { return resp.json() }
            return Promise.reject(resp);
        })
        .then(data => {
            console.log(data);
            insertExcursions(data);
        })
        .catch(err => console.error(err));
}