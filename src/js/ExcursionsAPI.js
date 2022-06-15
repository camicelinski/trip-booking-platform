class ExcursionsAPI {
    constructor() {
        this.urlExcursions = 'http://localhost:3000/excursions';
        this.urlOrders = 'http://localhost:3000/orders';
    }

    loadExcursionsData() {
        return this._fetch();
    }

    addExcursionsData(data) {
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            };

            return this._fetch(options)
    }

    removeExcursionsData(id) {
        const options = { method: 'DELETE' };
        return this._fetch(options, `/${id}`);
    }   

    updateExcursionsData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options, `/${id}`);
    }   

    addOrdersData(data) {
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