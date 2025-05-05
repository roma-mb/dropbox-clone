export default class Http {
  static get(url) {
    return Http.#request('GET', url);
  }

  static post(url, payload) {
    return Http.#request('POST', url, payload);
  }

  static postFormData(url, payload, uploadProgress = event => {}) {
    return Http.#request('POST', url, payload, uploadProgress);
  }

  static delete(url, payload) {
    return Http.#request('DELETE', url, payload);
  }

  static #request(method = 'GET', url = '', payload = '{}', uploadProgress = event => {}) {
    let xmlHttpRequest = new XMLHttpRequest();

    let response = new Promise((resolve, reject) => {
      xmlHttpRequest.open(method.toUpperCase(), url, true);

      if (!(payload instanceof FormData)) {
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
      }

      xmlHttpRequest.onload = () => {
        const done = xmlHttpRequest.readyState === xmlHttpRequest.DONE;
        const status = xmlHttpRequest.status;
        const success = done && status >= 200 && status < 400;
        const responseText = xmlHttpRequest.responseText;

        if (success) {
          return resolve(JSON.parse(responseText));
        }

        reject(responseText);
      };

      xmlHttpRequest.onerror = event => {
        reject(event);
      };

      xmlHttpRequest.upload.onprogress = uploadProgress;
    });

    xmlHttpRequest.send(payload);

    return response;
  }
}
