export default class Http {
    static get(url) {
        return Http.#request('GET', url);
    }

    static post(url, payload) {
        return Http.#request('POST', url, payload);
    }

    static postFormData(url, payload) {
        return Http.#request('POST', url, payload);
    }

    static #request(method = 'GET', url = '', payload = '{}') {
        let xmlHttpRequest = new XMLHttpRequest();

        let response = new Promise((resolve, reject) => {
            xmlHttpRequest.open(method.toUpperCase(), url, true);

            xmlHttpRequest.onload = () => {
                const done = xmlHttpRequest.readyState === xmlHttpRequest.DONE;
                const status = xmlHttpRequest.status;
                const success = done && (status >= 200 && status < 400);
                const responseText = xmlHttpRequest.responseText;

                if (success) {
                    return resolve(JSON.parse(responseText));
                }

                reject(responseText);
            }

            xmlHttpRequest.onerror = event => {
                reject(event);
            }
        });

        xmlHttpRequest.send(payload);

        return response;
    }
}
