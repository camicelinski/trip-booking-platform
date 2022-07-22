class ExcursionsAPI {
    constructor() {
        this.host = 'http://localhost:3000'
        this.urlExcursions = `${this.host}/excursions`;
        this.urlOrders = `${this.host}/orders`;
    }

    loadExcursions() {
        return this._fetch();
    }

    addExcursions(data) {
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            };

            return this._fetch(options)
    }

    removeExcursions(id) {
        const options = { method: 'DELETE' };
        return this._fetch(options, `/${id}`);
    }   

    updateExcursions(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options, `/${id}`);
    }   

    addOrders(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return fetch(this.urlOrders, options)
            .then(resp => {
                if(resp.ok) { return resp.json(); }
                return Promise.reject(resp); 
            }); 
    }
    
    _fetch(options, additionalPath = '') {
        const url = this.urlExcursions + additionalPath;
        return fetch(url, options)
            .then(resp => {
                if(resp.ok) { return resp.json(); }
                return Promise.reject(resp); 
            });          
    }
}

export default ExcursionsAPI;