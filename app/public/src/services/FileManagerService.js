import Http from "../helpers/Http.js";

export default class FileManagerService {
    uploadFile(files) {
        let promises = [];

        [...files].forEach(file => {
            let formData = new FormData();
            formData.append('input-file', file);

            let currentPromise = Http.postFormData('/uploads', formData);
            promises.push(currentPromise);
        });

        console.log(promises);

        return Promise.all(promises);
    }
}
