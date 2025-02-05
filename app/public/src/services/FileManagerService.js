import Http from "../helpers/Http.js";

export default class FileManagerService {
    uploadFile(files, progressElement = () => {}) {
        let promises = [];

        [...files].forEach(file => {
            let formData = new FormData();
            formData.append('input-file', file);

            let currentPromise = Http.postFormData(
                '/uploads',
                formData,
                event => progressElement(event)
            );

            promises.push(currentPromise);
        });

        return Promise.all(promises);
    }

    calcProgressBar(event, startTime) {
        let timeSpent = Date.now() - startTime;
        let loaded = event.loaded;
        let total = event.total;
        let percentProgress = parseInt((loaded / total) * 100);
        let timeLeft = parseInt(((100 - percentProgress) * timeSpent) / percentProgress);

        return {percentProgress, timeLeft};
    }
}
