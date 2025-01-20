export default class FileManagerController {
    constructor() {
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
        let promises = [];

        [...files].forEach(file => {
            let httpRequest = new XMLHttpRequest();

            let currentPromise = new Promise((resolve, reject) => {
                httpRequest.open('POST', '/upload');
                httpRequest.onload = event => {
                    try {
                        resolve(JSON.parse(httpRequest.responseText));
                    } catch(error) {
                        reject(error);
                    }
                };

                httpRequest.onerror = event => {
                    reject(event);
                };
            });

            let formData = new FormData();
            formData.append('input-file', file);
            httpRequest.send(formData);

            promises.push(currentPromise);
        });

        return Promise.all(promises);
    }
}