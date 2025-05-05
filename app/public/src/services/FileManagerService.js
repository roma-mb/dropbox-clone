import Http from '../helpers/Http.js';
import FileIconsRespository from '../repositories/FileIconsRespository.js';
import TemplateRespository from '../repositories/TemplateRespository.js';
import FirebaseRepository from '../repositories/FirebaseRepository.js';
import Utils from '../helpers/Utils.js';

export default class FileManagerService {
  constructor() {
    this.currentFolder = ['files'];

    this.nav = document.getElementById('browse-location');
    this.files = document.getElementById('files');
    this.snackBar = document.getElementById('react-snackbar-root');
    this.listOfFiles = document.getElementById('list-of-files-and-directories');
    this.btnSendFile = document.getElementById('btn-send-file');
    this.btnNewFolder = document.getElementById('btn-new-folder');
    this.btnRename = document.getElementById('btn-rename');
    this.btnDelete = document.getElementById('btn-delete');
    this.progressbar = this.snackBar.querySelector('.mc-progress-bar-fg');
    this.fileName = this.snackBar.querySelector('.filename');
    this.timeLeft = this.snackBar.querySelector('.timeleft');

    this.fileIconsRespository = new FileIconsRespository();
    this.templateRespository = new TemplateRespository();
    this.firebaseRepository = new FirebaseRepository('files');
    this.onSelectionChange = new Event('selectionchange');
  }

  loadEvents() {
    this.addEventBtnSendFile('click');
    this.addEventFiles('change');
    this.addEventBtnNewFolder('click');
    this.addEventBtnRename('click');
    this.addEventBtnDelete('click');
    this.fileEventsLoad();
  }

  fileEventsLoad() {
    this.addEventOnClickFile();
    this.addEventOnSelectionChange();
    this.addEventOnDoubleClickFile();
    this.addEventInsideOpenedFolder();
  }

  async loadFiles() {
    const files = await this.getFiles();

    files.forEach(file => {
      const fileData = file.data() ?? {};
      this.appendElement(file?.id, fileData);
    });

    this.fileEventsLoad();
  }

  addEventBtnSendFile(name) {
    this.btnSendFile.addEventListener(name, event => {
      this.files.click();
    });
  }

  addEventFiles(name) {
    this.files.addEventListener(name, event => {
      this.sendFiles(event.target.files);
      Utils.displayElement(this.snackBar);
    });
  }

  addEventBtnNewFolder(name) {
    this.btnNewFolder.addEventListener(name, event => {
      let name = prompt('Enter the folder name.');

      if (name) {
        this.createFolder(name)
          .then(data => console.log(data))
          .catch(error => console.error(error));
      }
    });
  }

  addEventBtnRename(name) {
    this.btnRename.addEventListener(name, async event => {
      const element = this.listOfFiles.querySelectorAll('.selected')[0];
      const id = element?.dataset?.key;
      const name = element?.dataset.name;

      if (!(id && name)) {
        return;
      }

      let originalFilename = prompt('Rename the file:', name);

      await this.updateFile(id, { originalFilename })
        .then(data => location.reload())
        .catch(error => console.error(error));
    });
  }

  addEventBtnDelete(name) {
    this.btnDelete.addEventListener(name, async event => {
      let files = [];

      this.listOfFiles.querySelectorAll('.selected').forEach(element => {
        files.push(element.dataset.key);
      });

      await this.fileManagerService
        .deleteFiles(files)
        .then(data => location.reload())
        .catch(error => console.error(error));
    });
  }

  addEventOnClickFile() {
    this.listOfFiles.childNodes.forEach(element => {
      element.addEventListener('click', event => {
        const parentElement = element.parentElement;

        if (event.ctrlKey) {
          element.classList.toggle('selected');
          element.dispatchEvent(this.onSelectionChange);
          return;
        }

        if (event.shiftKey) {
          element.classList.add('selected');
          element.dispatchEvent(this.onSelectionChange);
          let firstSelectedElement = null;
          let lastSelectedElement = null;

          parentElement.childNodes.forEach((child, key) => {
            let hasSelected = child.classList.contains('selected');

            if (hasSelected && !firstSelectedElement) {
              firstSelectedElement = child;
              return;
            }

            if (element === child) {
              lastSelectedElement = child;
              return;
            }

            if (firstSelectedElement && !lastSelectedElement) {
              child.classList.add('selected');
              child.dispatchEvent(this.onSelectionChange);
            }
          });

          return;
        }

        parentElement.childNodes.forEach(child => child.classList.remove('selected'));
        element.classList.toggle('selected');
        element.dispatchEvent(this.onSelectionChange);
      });
    });
  }

  addEventOnSelectionChange() {
    this.listOfFiles.childNodes.forEach(element => {
      element.addEventListener('selectionchange', event => {
        let selectedElements = this.listOfFiles.querySelectorAll('.selected');
        let currentElementLenght = selectedElements.length;
        this.btnRename.style.display = 'none';
        this.btnDelete.style.display = 'none';

        if (currentElementLenght === 1) {
          this.btnRename.style.display = 'block';
          this.btnDelete.style.display = 'block';
        }

        if (currentElementLenght > 1) {
          this.btnRename.style.display = 'none';
          this.btnDelete.style.display = 'block';
        }
      });
    });
  }

  addEventOnDoubleClickFile() {
    this.listOfFiles.childNodes.forEach(element => {
      element.addEventListener('dblclick', async event => {
        let filePath = element.dataset?.filepath;
        let type = element.dataset?.type;

        if (filePath && type === 'folder') {
          this.handleFolderOpen(filePath);
        }
      });
    });
  }

  async handleFolderOpen(filePath) {
    let nav = document.createElement('nav');
    const splitedPath = filePath.split('/');
    const lastFolder = splitedPath[splitedPath.length - 1] ?? 'files';

    splitedPath.push(lastFolder);
    this.currentFolder = splitedPath;

    let breadcrumbs = [...new Set(splitedPath)];
    let folderFilePath = [];

    breadcrumbs.forEach((folder, key) => {
      let capitalizeFolder = folder.charAt(0).toUpperCase() + folder.slice(1);

      if (breadcrumbs.length === key + 1) {
        nav.innerHTML += `
        <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
          ${capitalizeFolder}
        </span>`;

        return;
      }

      folderFilePath.push(folder);

      if (key > 0) {
        folderFilePath.push(folder);
      }

      nav.innerHTML += this.templateRespository.get('navSpan')(
        '#',
        folderFilePath.join('/'),
        capitalizeFolder,
      );
    });

    this.nav.innerHTML = nav.innerHTML;

    const files = await this.getFilesByFolder(`${filePath}/${lastFolder}`);

    this.listOfFiles.innerHTML = '';

    files.forEach(file => {
      const fileData = file?.data() ?? {};
      this.appendElement(file?.id, fileData);
    });

    this.fileEventsLoad();
  }

  addEventInsideOpenedFolder() {
    let nav = document.createElement('nav');

    this.nav.querySelectorAll('a').forEach(segment => {
      segment.addEventListener('click', async event => {
        event.preventDefault();

        const currentPath = event.target.dataset.path;
        let splitedPath = currentPath.split('/');

        this.currentFolder = splitedPath;

        let breadcrumbs = [...new Set(splitedPath)];
        let folderFilePath = [];

        breadcrumbs.forEach((folder, key) => {
          let capitalizeFolder = folder.charAt(0).toUpperCase() + folder.slice(1);

          if (breadcrumbs.length === key + 1) {
            console.log('inside');
            nav.innerHTML += `
            <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
              ${capitalizeFolder}
            </span>`;

            return;
          }

          folderFilePath.push(folder);

          if (key > 0) {
            folderFilePath.push(folder);
          }

          nav.innerHTML += this.templateRespository.get('navSpan')(
            '#',
            folderFilePath.join('/'),
            capitalizeFolder,
          );
        });

        this.nav.innerHTML = nav.innerHTML;

        const collection = breadcrumbs.length === 1 ? breadcrumbs[0] : this.currentFolder.join('/');

        const files = await this.getFilesByFolder(collection);

        this.listOfFiles.innerHTML = '';

        files.forEach(file => {
          const fileData = file?.data() ?? {};
          this.appendElement(file?.id, fileData);
        });

        this.fileEventsLoad();
      });
    });
  }

  async sendFiles(files) {
    let startTime = Date.now();

    let progressElement = event => {
      const { percentProgress, timeLeft } = this.calcProgressBar(event, startTime);
      const { seconds, minutes, hours } = Utils.getTimeByMiliseconds(timeLeft);

      this.progressbar.style.width = `${percentProgress}%`;
      this.timeLeft.textContent = Utils.formatTimeLeft(hours, minutes, seconds);
    };

    let fileOutput = file => (this.fileName.textContent += `${file?.name ?? ''} `);

    let uploadedFiles = await this.uploadFiles(files, progressElement, fileOutput);

    Utils.displayElement(this.snackBar);

    if (!uploadedFiles) {
      console.error(uploadedFiles);
      return;
    }

    uploadedFiles.forEach(async file => {
      this.saveOnSnapshot(file, onSnapshot => {
        const fileData = onSnapshot.data() ?? {};
        this.appendElement(onSnapshot?.id, fileData);
      });
    });

    this.fileName.value = '';

    this.fileEventsLoad();
  }

  calcProgressBar(event, startTime) {
    let timeSpent = Date.now() - startTime;
    let loaded = event.loaded;
    let total = event.total;
    let percentProgress = parseInt((loaded / total) * 100);

    let timeLeft = parseInt(((100 - percentProgress) * timeSpent) / percentProgress);

    return { percentProgress, timeLeft };
  }

  uploadFiles(files, progressElement = () => {}, fileOutput = () => {}) {
    let promises = [];

    [...files].forEach(file => {
      let formData = new FormData();

      formData.append('input-file', file);
      fileOutput(file);

      let currentPromise = Http.postFormData('/files/uploads', formData, event =>
        progressElement(event),
      );

      promises.push(currentPromise);
    });

    return Promise.all(promises);
  }

  appendElement(id, fileData) {
    if (!id) return;

    const name = fileData?.originalFilename;
    const type = fileData?.mimetype;
    const filepath = fileData?.filepath;
    let tagIcon = this.createTagIcon(name, type);

    tagIcon.dataset.key = id;
    tagIcon.dataset.name = name;
    tagIcon.dataset.type = type;
    tagIcon.dataset.filepath = filepath;

    this.listOfFiles.appendChild(tagIcon);
  }

  createTagIcon(name = 'default', type = 'default') {
    const iconType = this.fileIconsRespository.getIconByType(type);
    let li = document.createElement('li');
    li.innerHTML = `${iconType}<div class="name text-center">${name}</div>`;

    return li;
  }

  async deleteFiles(fileIds) {
    let promises = [];

    fileIds.forEach(async id => {
      let file = await this.firebaseRepository.deleteDocument(id);
      const response = Http.delete('/files/delete', JSON.stringify(file));
      promises.push(response);
    });

    return Promise.all(promises);
  }

  async createFolder(name) {
    const documentRef = `${this.currentFolder.join('/')}/${name}`;

    const folder = {
      filepath: documentRef,
      mimetype: 'folder',
      originalFilename: name,
    };

    return this.firebaseRepository.set(documentRef, folder);
  }

  async saveOnSnapshot(document, on = () => {}) {
    const file = document?.files['input-file'][0] ?? {};
    const collection = this.currentFolder.join('/');
    return this.firebaseRepository.setCollection(collection).saveOnSnapshot(file, on);
  }

  async getFiles() {
    return await this.firebaseRepository.documents();
  }

  async getFilesByFolder(folder) {
    return await this.firebaseRepository.getFilesByFolder(folder);
  }

  async updateFile(id, attributes) {
    return this.firebaseRepository.updateDocument(id, attributes);
  }
}
