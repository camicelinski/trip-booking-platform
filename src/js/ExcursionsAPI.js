class ExcursionsAPI {
    constructor() {
        this.urlExcursions = 'http://localhost:3000/excursions';
        this.urlOrders = 'http://localhost:3000/orders';
    }

    loadExcursionsData() {
        return this._fetch();
        //fetch(this.urlExcursions)
        //    .then(resp => {
        //        if(resp.ok) { return resp.json(); }
        //        return Promise.reject(resp);
        //    });
            //.then(data => {
            //    console.log(data);
            //    showExcursions(data);
            //})
            //.catch(err => console.error(err));
    }

    addExcursionsData(data) {
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            };

            return this._fetch(options)
            //fetch(urlExcursions, options)
            //    .then(resp => {
            //       if(resp.ok) { return resp.json(); }
            //       return Promise.reject(resp); 
            //    });          
    }

    removeExcursionsData(id) {
        const options = { method: 'DELETE' };
        return this._fetch(options, `/${id}`);
        //            .then(resp => console.log(resp))
        //            .catch(err => console.error(err))
        //            .finally(loadExcursions);
        //    }       
        //})
    }   

    updateExcursionsData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options, `/${id}`);
        //fetch(`${urlExcursions}/${id}`, options)
        //    .then(resp => console.log(resp))
        //    .catch(err => console.error(err))
        //    .finally( () => {
        //        targetEl.value = 'edytuj';
        //        editableList.forEach(
        //            item => item.contentEditable = false
        //        );
        //    });        
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