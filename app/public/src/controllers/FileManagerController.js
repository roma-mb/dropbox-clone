import Utils from "../helpers/Utils.js";
import FileManagerService from "../services/FileManagerService.js";

export default class FileManagerController {
    constructor() {
        this.fileManagerService = new FileManagerService();
        this.btnSendFile = document.getElementById('btn-send-file');
        this.files = document.getElementById('files');
        this.snackBar = document.getElementById('react-snackbar-root');
        this.progressbar = this.snackBar.querySelector('.mc-progress-bar-fg');
        this.fileName = this.snackBar.querySelector('.filename');
        this.timeLeft = this.snackBar.querySelector('.timeleft');

        this.#loadEvents();
    }

    #loadEvents() {
        this.btnSendFile.addEventListener('click', (event) => {
            this.files.click();
        }); 

        this.files.addEventListener('change', (event) => {
            this.sendFiles(event.target.files);
            this.toggleSnackBar();
        });
    }

    async sendFiles(files) {
        let startTime = Date.now();
        
        await this.fileManagerService.uploadFile(files, event => {
            const {percentProgress, timeLeft} = this.fileManagerService.calcProgressBar(event, startTime);
            const {seconds, minutes, hours} = Utils.getTimeByMiliseconds(timeLeft);

            this.progressbar.style.width = `${percentProgress}%`;
            this.timeLeft.textContent = Utils.formatTimeLeft(hours, minutes, seconds);
        });

        this.toggleSnackBar();
    }

    toggleSnackBar() {
        let snackBarDisplay = this.snackBar.style.display;

        this.snackBar.style.display = (snackBarDisplay === 'none')
            ? 'block'
            : 'none';
    }
}
