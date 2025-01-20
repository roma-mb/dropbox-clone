export default class Fetch {

    static get(url) {
        return Fetch.#request('GET', url);
    }

    static post(url, payload) {
        return Fetch.#request('POST', url, payload);
    }

    static #request(method = 'GET', url = '', payload = {}) {
        let request;

        const hasNoContentType = (method === 'GET' && method === 'DELETE');

        if(hasNoContentType) {
            request = url;
        }

        if(!hasNoContentType) {
            request = new Request(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
        }
        
        return fetch(request);
    }
}
