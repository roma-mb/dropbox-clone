import FileManagerService from "../services/FileManagerService.js";

export default class FileManagerController {
    constructor() {
        this.fileManagerService = new FileManagerService();
        this.btnSendFile = document.getElementById('btn-send-file');
        this.files = document.getElementById('files');
        this.snackBar = document.getElementById('react-snackbar-root');

        this.#loadEvents();
    }

    #loadEvents() {
        this.btnSendFile.addEventListener('click', (event) => {
            this.files.click();
        }); 

        this.files.addEventListener('change', (event) => {
            this.sendFiles(event.target.files);
            this.snackBar.style.display = 'block';
        });
    }

    async sendFiles(files) {
       this.fileManagerService.uploadFile(files).then(data => console.log(data));
        // console.log(response);
    }
}
