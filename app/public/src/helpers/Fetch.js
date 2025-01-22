export default class Fetch {

    static get(url) {
        return Fetch.#request('GET', url);
    }

    static post(url, payload) {
        return Fetch.#request('POST', url, payload);
    }

    static postFormData(url, payload) {
        return Fetch.#request('POST', url, payload);
    }

    static #request(method = 'GET', url = '', payload = '{}') {
        let request;

        const hasNoContentType = (method === 'GET' || method === 'DELETE');

        request = hasNoContentType
            ? url
            : new Request(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: payload
            });

        if (payload instanceof FormData) {
            request.headers.append('Content-Type', 'multipart/form-data');
        }
        
        return fetch(request);
    }
}
