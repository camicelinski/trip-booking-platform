export function clearUl(ulEl) {
    const liList = ulEl.querySelectorAll('li');
    const liListArr = Array.prototype.slice.call(liList);
    liListArr.splice(0, 1);
    liListArr.forEach(item => ulEl.removeChild(item));
}

export function clearFormFields(fieldsList) {    
    fieldsList.forEach(field => field.value = '');
}

export function findUl(selector) {
    return document.querySelector(selector)
}

export function findLi(targetEl) {
    const liEl = targetEl.parentElement.parentElement.parentElement;
    return liEl;
}

export function findId(liEl) {
    const id = liEl.dataset.id;
    return id;
}

export function isItemEditable(editableList) {    
    const isEditable = [...editableList].every(
         item => item.isContentEditable
    );

    return isEditable;
}