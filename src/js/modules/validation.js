function Error(field, text) {
    this.field = field;
    this.text = text;
}

export function validateExcursionsForm(form, data) {
    const formEl = form

    const errors = []     

    const [adultField, childField] = form.elements

    const adultNumber = data.adultNumber
    const childNumber = data.childNumber

    const fields = [
        {
            name: 'adults',
            label: 'Dorosły',
            type: 'number',
            pattern: '^[0-9]+$',
        },
        {
            name: 'children',
            label: 'Dziecko',
            type: 'number',
            pattern: '^[0-9]+$',          
        }
    ]

    validateForm(formEl, fields, errors)

    if(adultNumber === 0 && childNumber === 0) {
        errors.push(new Error(childField, 'Co najmniej jedno z pol musi zawierać liczbę.'))
    }

    return errors
}

export function validateOrderForm(form) {
    const formEl = form

    const errors = [] 

    const fields = [
        {
            name: 'name',
            label: 'Imię i nazwisko',
            required: true,
            pattern: '^[a-zA-Z –-]+$',
        },
        {
            name: 'email',
            label: 'Email',
            required: true,
            pattern: '([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$',            
        }
    ]

    validateForm(formEl, fields, errors)

    return errors
}

function validateForm(formEl, fields, errors) {    
    fields.forEach(field => {
        const fieldEl = formEl.elements[field.name]
        const value = fieldEl.value
        
        if (field.required) {
            if(value.length === 0) {
                errors.push(new Error(fieldEl, `Pole "${field.label}" jest wymagane.`))
                return errors
            }            
        }        

        if(field.type === 'number') {
            const reg = new RegExp(field.pattern)
            if(!reg.test(Number(value)) || value < 0) {
                errors.push(new Error(fieldEl, 'Pole musi zawierać całkowitą liczbę dodatnią.'))
            }
        }

        if(field.pattern && field.type !== 'number') {
            const reg = new RegExp(field.pattern)
            if(!reg.test(value)) {
                errors.push(new Error(fieldEl, `Dane w polu "${field.label}" zawierają niedozwolone znaki lub nie są zgodne z przyjętym wzorem.`))
            }
        }
    })

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

export function clearErrorsMessages() {
    const errorsMessages = document.querySelectorAll('.error')
    errorsMessages.forEach(message => {
        message.parentNode.removeChild(message)
    })
}