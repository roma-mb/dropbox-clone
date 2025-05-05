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
    const hasNoContentType = method === 'GET' || method === 'DELETE';

    if (hasNoContentType) {
      return fetch(url);
    }

    let requestConfig = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    };

    if (payload instanceof FormData) {
      delete requestConfig.headers;
    }

    let request = new Request(url, requestConfig);

    return fetch(request);
  }
}
