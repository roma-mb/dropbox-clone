import Http from "../helpers/Http.js";
import FileIconsRespository from "../repositories/FileIconsRespository.js";

export default class FileManagerService {
    constructor() {
        this.fileIconsRespository = new FileIconsRespository();
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

    createTagIcon(file) {
        const iconType = this.fileIconsRespository.getIconByType(file.type ?? 'default');

        return `<li>
        ${iconType}
        <div class="name text-center">${file.name ?? '#.file'}</div>
        </li>`;
    }
}
