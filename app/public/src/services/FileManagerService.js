import Fetch from "../helpers/Fetch.js";

export default class FileManagerService {
    uploadFile(files) {
        let promises = [];

        [...files].forEach(file => {
            let formData = new FormData();
            formData.append('input-file', file);

            let currentPromise = Fetch.postFormData('/uploads', formData);
            promises.push(currentPromise);
        });

        return Promise.all(promises);
    }
}
