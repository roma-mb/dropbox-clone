import FileManagerService from "../services/FileManagerService.js";
import Utils from "../helpers/Utils.js";

export default class FileManagerController {
    constructor() {
        this.fileManagerService = new FileManagerService();
        this.btnSendFile = document.getElementById('btn-send-file');
        this.files = document.getElementById('files');
        this.snackBar = document.getElementById('react-snackbar-root');
        this.progressbar = this.snackBar.querySelector('.mc-progress-bar-fg');
        this.fileName = this.snackBar.querySelector('.filename');
        this.timeLeft = this.snackBar.querySelector('.timeleft');
        this.listOfFiles = document.getElementById('list-of-files-and-directories');

        this.#loadEvents();
    }

    #loadEvents() {
        this.btnSendFile.addEventListener('click', (event) => {
            this.files.click();
        }); 

        this.files.addEventListener('change', (event) => {
            this.sendFiles(event.target.files);
            Utils.displayElement(this.snackBar);
        });
    }

    async sendFiles(files) {
        let startTime = Date.now();

        let fileOutput = file => {
            const tagIcon = this.fileManagerService.createTagIcon(file);
            this.fileName.textContent += `${file.name} `;
            this.listOfFiles.innerHTML += tagIcon;
        };

        let progressElement = event => {
            const {percentProgress, timeLeft} = this.fileManagerService.calcProgressBar(event, startTime);
            const {seconds, minutes, hours} = Utils.getTimeByMiliseconds(timeLeft);

            this.progressbar.style.width = `${percentProgress}%`;
            this.timeLeft.textContent = Utils.formatTimeLeft(hours, minutes, seconds);
        };

        await this.fileManagerService.uploadFiles(files, progressElement, fileOutput);

        Utils.displayElement(this.snackBar);
    }
}
