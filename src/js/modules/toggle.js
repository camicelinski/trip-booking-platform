import { clearErrorsMessages } from './validation'

export function toggleAddingItem(hamburger, ulEl) {    
    const openSummary = hamburger.querySelector('.open-summary')         
    const summaryList = ulEl.querySelectorAll('.summary__item')

    if(summaryList.length > 1) {
        hamburger.style.display = 'block'            
        hamburger.addEventListener('click', toggleSummary)
        if(ulEl.classList.contains('show-element')) {
            openSummary.style.display = 'none'
        } else {
            openSummary.style.display = 'block'
        }             
                        
        const toggler = document.querySelector('.toggler')            
        toggler.removeEventListener('click', toggleUserData, true)
        toggler.addEventListener('click', toggleUserData, true)
    } else {            
        hamburger.style.display = 'none'
    }         
}

export function toggleRemovingItem(ulEl) {
    const summaryList = ulEl.querySelectorAll('.summary__item')
    if(summaryList.length <= 1) {
        const hamburger = document.querySelector('.hamburger')
        hamburger.style.display = 'none'
        toggleSummary()
    
        const order = document.querySelector('.order')
        toggleSubmit(order)   
    }
}

export function toggleSubmit(order, summary) {
        const orderUserData = order.querySelector('.order__userdata')
        const openFields= order.querySelector('.open-userdata')
        const closeFields = order.querySelector('.close-userdata')       
        const submit = order.querySelector('.order__field--submit')
        if(submit.classList.contains('show-element') && orderUserData.classList.contains('show-element')) {
            submit.classList.remove('show-element')
            orderUserData.classList.remove('show-element')
            closeFields.style.display = 'none'
            openFields.style.display = 'block'
        }        

        if(summary.classList.contains('show-element')) {
            toggleSummary()
        }
}

function toggleSummary() {
    const summary = document.querySelector('.summary')
    const openSummary= document.querySelector('.open-summary')
    const closeSummary = document.querySelector('.close-summary')

    toggle(summary, openSummary, closeSummary)
}

function toggleUserData(e) {
    e.preventDefault()

    const order = document.querySelector('.order')
    const orderUserData = order.querySelector('.order__userdata')
    const openFields= order.querySelector('.open-userdata')
    const closeFields = order.querySelector('.close-userdata')       
    const submit = order.querySelector('.order__field--submit')

    const summaryList = document.querySelectorAll('.summary__item')
    if(summaryList.length <= 1) {        
        alert('Nie dodałeś/aś żadnej wycieczki do listy zamówień.')
    } else {
        toggle(submit, openFields, closeFields)
        toggle(orderUserData, openFields, closeFields)    
        clearErrorsMessages()
    }
    
}

function toggle(el, openIcon, closeIcon) {
    if (el.classList.contains('show-element')) {
        el.classList.remove('show-element')
        closeIcon.style.display = 'none'
        openIcon.style.display = 'block'
    } else {
        el.classList.add('show-element')
        closeIcon.style.display = 'block'
        openIcon.style.display = 'none'
    }
}