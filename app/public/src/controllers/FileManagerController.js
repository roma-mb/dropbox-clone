import FileManagerService from "../services/FileManagerService.js";
import Utils from "../helpers/Utils.js";

export default class FileManagerController {
    constructor() {
        this.onSelectionChange = new Event('onSelectionChange');

        this.fileManagerService = new FileManagerService();
        this.btnSendFile = document.getElementById('btn-send-file');
        this.files = document.getElementById('files');
        this.snackBar = document.getElementById('react-snackbar-root');
        this.progressbar = this.snackBar.querySelector('.mc-progress-bar-fg');
        this.fileName = this.snackBar.querySelector('.filename');
        this.timeLeft = this.snackBar.querySelector('.timeleft');
        this.listOfFiles = document.getElementById('list-of-files-and-directories');

        this.#loadEvents();
        this.loadFiles();
    }

    #loadEvents() {
        this.btnSendFile.addEventListener('click', (event) => {
            this.files.click();
        }); 

        this.files.addEventListener('change', (event) => {
            this.sendFiles(event.target.files);
            Utils.displayElement(this.snackBar);
        });

        this.listOfFiles.addEventListener('onSelectionChange', event => {
            console.log('here')
        });
    }

    async sendFiles(files) {
        let startTime = Date.now();

        let progressElement = event => {
            const {percentProgress, timeLeft} = this.fileManagerService.calcProgressBar(event, startTime);
            const {seconds, minutes, hours} = Utils.getTimeByMiliseconds(timeLeft);

            this.progressbar.style.width = `${percentProgress}%`;
            this.timeLeft.textContent = Utils.formatTimeLeft(hours, minutes, seconds);
        };

        let fileOutput = file => this.fileName.textContent += `${file?.name ?? ''} `;
        let uploadedFiles = await this.fileManagerService.uploadFiles(files, progressElement, fileOutput);
        
        Utils.displayElement(this.snackBar);

        if (!uploadedFiles) {
            console.error(uploadedFiles);
            return;
        }
        
        uploadedFiles.forEach(async file => {
            this.fileManagerService.saveOnSnapshot(file, onSnapshot => {
                const fileData = onSnapshot.data();

                this.#createTagIcon(
                    onSnapshot?.id,
                    fileData?.originalFilename,
                    fileData?.mimetype
                );
            });
        });

        this.fileName.value = '';
    }

    async loadFiles() {
        const files = await this.fileManagerService.getFiles();
        
        files.forEach(file => {
            const fileData = file.data();

            this.#createTagIcon(
                file?.id,
                fileData?.originalFilename,
                fileData?.mimetype
            );
        });
    }

    #createTagIcon(id, name = 'default', type = 'default') {
        if (!id) return;
        let tagIcon = this.fileManagerService.createTagIcon(name, type);
        tagIcon.dataset.key = id;
        tagIcon.dispatchEvent(this.onSelectionChange);

        this.listOfFiles.appendChild(tagIcon);
    }
}
