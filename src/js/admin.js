import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('admin');

const api = new ExcursionsAPI();

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
    const formEl = document.querySelector('.form');
    formEl.addEventListener('submit', e => {
        e.preventDefault();

        const targetEl = e.target;    
        const data = createExcursionData(targetEl);

        api.addExcursionsData(data)    
            .catch(err => console.error(err))
            .finally(loadExcursions);
    });   
}

function showExcursions(excursionsList) {
    const ulEl = findUl();
    const liPrototype = ulEl.querySelector('.excursions__item--prototype');

    clearUl(ulEl);

    excursionsList.forEach(item => {
        const liEl = createExcursionLi(item, liPrototype);
        ulEl.appendChild(liEl)               
        
        const formEl = document.querySelector('.form');
        clearFormFields(formEl);
    })
}

function removeExcursions() {
    const ulEl = findUl();
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;     
        
        if(targetEl.value === 'usuń') {
            const liEl = findLi(targetEl);
            const id = findId(liEl);

            api.removeExcursionsData(id)
                .catch(err => console.error(err))
                .finally(loadExcursions);
        }       
    })
}   

function updateExcursions() {
    const ulEl = findUl();
    ulEl.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;
        const liEl = findLi(targetEl);
        
        if(targetEl.value === 'edytuj' || targetEl.value === 'zapisz') {            
            const editableList = liEl.querySelectorAll('.excursions--editable')
            const isEditable = isItemEditable(editableList);
            if(isEditable) {
                const id = findId(liEl);
                const data = {
                    title: editableList[0].innerText, 
                    description: editableList[1].innerText,
                    adultPrice: editableList[2].innerText,
                    childPrice: editableList[3].innerText,
                }
                
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

function createExcursionData(targetEl) {
    const {title, description, adultPrice, childPrice} = targetEl.elements;
    return {
        title: title.value, 
        description: description.value,
        adultPrice: adultPrice.value,
        childPrice: childPrice.value,
    };
}

function clearUl(ulEl) {
    const liList = ulEl.querySelectorAll('li');
    console.log(liList)
    const liListArr = Array.prototype.slice.call(liList);
    liListArr.splice(0, 1);
    console.log(liListArr)
    liListArr.forEach(item => ulEl.removeChild(item));
}

function clearFormFields(formEl) {
    const formFields = formEl.querySelectorAll('.form__field');
    console.log(formFields);
    formFields.forEach(field => field.value = '');
}

function findUl() {
    return document.querySelector('.panel__excursions')
}

function findLi(targetEl) {
    const liEl = targetEl.parentElement.parentElement.parentElement;
    return liEl;
}

function findId(liEl) {
    const id = liEl.dataset.id;
    return id;
}

function isItemEditable(editableList) {
    console.log(editableList)
    const isEditable = [...editableList].every(
         item => item.isContentEditable
    );

    return isEditable;
}