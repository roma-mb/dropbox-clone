import Http from "../helpers/Http.js";
import FileIconsRespository from "../repositories/FileIconsRespository.js";
import FirebaseRepository from "../repositories/FirebaseRepository.js";

export default class FileManagerService {
    constructor() {
        this.fileIconsRespository = new FileIconsRespository();
        this.firebaseRepository = new FirebaseRepository('files');
    }

    uploadFiles(files, progressElement = () => {}, fileOutput = () => {}) {
        let promises = [];

        [...files].forEach(file => {
            let formData = new FormData();
            formData.append('input-file', file);

            fileOutput(file);

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

    createTagIcon(name = 'default', type = 'default') {
        const iconType = this.fileIconsRespository.getIconByType(type);
        let li = document.createElement('li');

        li.innerHTML = `
        ${iconType}
        <div class="name text-center">${name}</div>`; 

        return li;
    }

    async save(document) {
        const file = document?.files['input-file'][0] ?? {};
        return await this.firebaseRepository.save(file);
    }

    async saveOnSnapshot(document, on = () => {}) {
        const file = document?.files['input-file'][0] ?? {};
        return this.firebaseRepository.saveOnSnapshot(file, on);
    }

    async getFiles() {
        return await this.firebaseRepository.documents();
    }
}
