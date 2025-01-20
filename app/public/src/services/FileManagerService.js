import Fetch from "../helpers/Fetch.js";

export default class FileManagerService {
    uploadFile(files) {
        let promises = [];

        [...files].forEach(file => {
            let currentPromise = new Promise((resolve, reject) => {
                Fetch.post('/upload', file).then(data => {
                    console.log(data);
                    resolve(data.responseText);
                }).catch(error => {
                    reject(error);
                });
            });

            promises.push(currentPromise);
        });

        return Promise.all(promises);
    }
}
