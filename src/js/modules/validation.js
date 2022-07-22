function Error(field, text) {
    this.field = field;
    this.text = text;
}

export function validateExcursionsForm(fields, data) {
    const errors = [] 

    const adultField = fields[0];
    const childField = fields[1];

    const adultNumber = data.adultNumber
    const childNumber = data.childNumber

    const regNumber = /^[0-9]+$/

    if(!regNumber.test(adultNumber) || adultNumber < 0) {
        errors.push(new Error(adultField, 'Pole musi zawierać liczbę.'))
    } 
    if(!regNumber.test(childNumber) || childNumber < 0) {
        errors.push(new Error(childField, 'Pole musi zawierać liczbę.'))
    }
    if(adultNumber === 0 && childNumber === 0) {
        errors.push(new Error(childField, 'Co najmniej jedno z pol musi zawierać liczbę.'))
    }
    
    return errors
}

export function validateOrderForm(fields, data) {
    const errors = [] 
    
    const nameField = fields[0];
    const emailField = fields[1];

    const name = data.name
    const email = data.email

    const regName = /^[a-zA-ZąćężźłóńśĄĆĘŻŹŁÓŃŚ \-]+$/;
    
    if(!regName.test(name)) {
        if(name.length === 0) {
            errors.push(new Error(nameField, 'Pole "Imię i nazwisko" jest wymagane.'))
        } else {
            errors.push(new Error(nameField, 'Pole imię i nazwisko może zawierać tylko litery i "-".'))
        }
    }
    
    if(!email.includes('@')) {
        if(email.length === 0) {
            errors.push(new Error(emailField, 'Pole "Email" jest wymagane.'))
        } else {
            errors.push(new Error(emailField, 'Email musi zawierać znak "@".'))
        }
    }     

    return errors
}

export function showErrors(errors) {
    errors.forEach(error => {
        const pEl = document.createElement('p')
        pEl.classList.add('error')
        const errorPreviousEl = error.field
        pEl.innerText = error.text
        errorPreviousEl.after(pEl)
    })
}

export function clearErrors() {
    const errorsMessages = document.querySelectorAll('.error')
    errorsMessages.forEach(message => {
        message.parentNode.removeChild(message)
    })
}