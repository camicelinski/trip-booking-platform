import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('admin');

const api = new ExcursionsAPI();
const urlExcursions = 'http://localhost:3000/excursions';

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOM');

    loadExcursions();
    addExcursions();
    removeExcursions();
    updateExcursions();
}

function loadExcursions() {
    api.loadExcursionsData()
        .then(data => {
            console.log(data);
            showExcursions(data);
        })
        .catch(err => console.error(err));
}

function addExcursions() {
    const ulEl = document.querySelector('.panel__excursions');

    const formEl = document.querySelector('.form');
    formEl.addEventListener('submit', e => {
        e.preventDefault();
    
        const {title, description, adultPrice, childPrice} = e.target.elements;
        const data = {
            title: title.value, 
            description: description.value,
            adultPrice: adultPrice.value,
            childPrice: childPrice.value,
        }; 
        console.log(data)

        //const options = {
        //    method: 'POST',
        //    body: JSON.stringify(data),
        //    headers: {'Content-Type': 'application/json'}
        //};
        //fetch(urlExcursions, options)
        //    .then(resp => console.log(resp))
        api.addExcursionsData(data)    
            .catch(err => console.error(err))
            .finally(loadExcursions);
    });   
}

function showExcursions(excursionsArr) {
    const ulEl = document.querySelector('.panel__excursions');
    const liPrototype = ulEl.querySelector('.excursions__item--prototype');
    const liList = ulEl.querySelectorAll('.excursions__item');
    console.log(liList)
    const liListArr = Array.prototype.slice.call(liList);
    liListArr.splice(0, 1);
    console.log(liListArr)
    liListArr.forEach(item => ulEl.removeChild(item));

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
        
        const formEl = document.querySelector('.form');
        const formFields = formEl.querySelectorAll('.form__field');
        console.log(formFields);
        formFields.forEach(field => field.value = '');
    })
}

function removeExcursions() {
    const ulEl = document.querySelector('.panel__excursions');
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;        
        console.log(targetEl)
        
        //const options = { method: 'DELETE' };
        if(targetEl.value === 'usuń') {
            const liEl = targetEl.parentElement.parentElement.parentElement
            const id = liEl.dataset.id;
            //fetch(`${urlExcursions}/${id}`, options)
            api.removeExcursionsData(id)
                //.then(resp => console.log(resp))
                .catch(err => console.error(err))
                .finally(loadExcursions);
        }       
    })
}   

function updateExcursions() {
    const ulEl = document.querySelector('.panel__excursions');
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;
        const liEl = targetEl.parentElement.parentElement.parentElement
        console.log(targetEl)
        console.log(liEl)
        
        if(targetEl.value === 'edytuj' || targetEl.value === 'zapisz') {
            const editableList = liEl.querySelectorAll('.excursions--editable')
            console.log(editableList)
            const isEditable = [...editableList].every(
                item => item.isContentEditable
            );
            if(isEditable) {
                const id = liEl.dataset.id;
                const data = {
                    title: editableList[0].innerText, 
                    description: editableList[1].innerText,
                    adultPrice: editableList[2].innerText,
                    childPrice: editableList[3].innerText,
                }
                //const options = {
                //    method: 'PUT',
                //    body: JSON.stringify(data),
                //    headers: {'Content-Type': 'application/json'}
                //};
                //fetch(`${urlExcursions}/${id}`, options)
                //    .then(resp => console.log(resp))
                api.updateExcursionsData(id, data)
                    .catch(err => console.error(err))
                    .finally( () => {
                        targetEl.value = 'edytuj';
                        editableList.forEach(
                            item => item.contentEditable = false
                        );
                    });
            } else {
                targetEl.value = 'zapisz';
                editableList.forEach(
                    item => item.contentEditable = true
                );
            }
        }
    });
}   