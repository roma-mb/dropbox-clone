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
       let responses = await this.fileManagerService.uploadFile(files);
       const isIterable = typeof responses[Symbol.iterator] === 'function';

       if(isIterable) {
        responses.forEach(response => this.test(response));
       }       
    }

    async test(response) {
        // const reader = response.body.getReader();
        // const contentLength = +response.headers.get('Content-Length');
        // let receivedLength = 0;

        // const {done, value} = await reader.read();

        console.log(response);

        // while(true) {
        //     const {done, value} = await reader.read();

        //     if(done) {
        //         break;
        //     }

        //     receivedLength += value.length;

        //     console.log(`Received ${receivedLength} of ${contentLength}`)
        // }
    }
}
