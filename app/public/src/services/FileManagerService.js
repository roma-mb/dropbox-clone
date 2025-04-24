import Http from '../helpers/Http.js';
import FileIconsRespository from '../repositories/FileIconsRespository.js';
import FirebaseRepository from '../repositories/FirebaseRepository.js';

export default class FileManagerService {
  constructor() {
    this.currentFolder = ["files"];
    this.fileIconsRespository = new FileIconsRespository();
    this.firebaseRepository = new FirebaseRepository('files');
    this.onSelectionChange = new Event("selectionchange");

    this.listOfFiles = document.getElementById("list-of-files-and-directories");

    this.btnNewFolder = document.getElementById("btn-new-folder");
    this.btnRename = document.getElementById("btn-rename");
    this.btnDelete = document.getElementById("btn-delete");
  }

  uploadFiles(files, progressElement = () => {}, fileOutput = () => {}) {
    let promises = [];

    [...files].forEach((file) => {
      let formData = new FormData();

      formData.append("input-file", file);
      fileOutput(file);

      let currentPromise = Http.postFormData('/files/uploads', formData, (event) =>
        progressElement(event)
      );

      promises.push(currentPromise);
    });

    return Promise.all(promises);
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

  calcProgressBar(event, startTime) {
    let timeSpent = Date.now() - startTime;
    let loaded = event.loaded;
    let total = event.total;
    let percentProgress = parseInt((loaded / total) * 100);

    let timeLeft = parseInt(
      ((100 - percentProgress) * timeSpent) / percentProgress
    );

    return { percentProgress, timeLeft };
  }

  appendElement(id, fileData, listOfFiles, btnRename, btnDelete) {
    if (!id) return;

    const name = fileData?.originalFilename;
    const type = fileData?.mimetype;
    const filepath = fileData?.filepath;
    let tagIcon = this.createTagIcon(name, type);

    tagIcon.dataset.key = id;
    tagIcon.dataset.name = name;
    tagIcon.dataset.type = type;
    tagIcon.dataset.filepath = filepath;

    listOfFiles.appendChild(tagIcon);

    tagIcon.addEventListener("selectionchange", (event) => {
      let selectedElements = listOfFiles.querySelectorAll(".selected");
      let currentElementLenght = selectedElements.length;
      btnRename.style.display = "none";
      btnDelete.style.display = "none";

      if (currentElementLenght === 1) {
        btnRename.style.display = "block";
        btnDelete.style.display = "block";
      }

      if (currentElementLenght > 1) {
        btnRename.style.display = "none";
        btnDelete.style.display = "block";
      }
    });
  }

  createTagIcon(name = "default", type = "default") {
    const iconType = this.fileIconsRespository.getIconByType(type);
    let li = document.createElement("li");
    li.innerHTML = `${iconType}<div class="name text-center">${name}</div>`;

    this.selectedElementEvent(li, (element, event) => {
      const parentElement = element.parentElement;

      if (event.ctrlKey) {
        element.classList.toggle("selected");
        return;
      }

      if (event.shiftKey) {
        element.classList.add("selected");
        let firstSelectedElement = null;
        let lastSelectedElement = null;

        parentElement.childNodes.forEach((child, key) => {
          let hasSelected = child.classList.contains("selected");

          if (hasSelected && !firstSelectedElement) {
            firstSelectedElement = child;
            return;
          }

          if (element === child) {
            lastSelectedElement = child;
            return;
          }

          if (firstSelectedElement && !lastSelectedElement) {
            child.classList.add("selected");
          }
        });

        return;
      }

      parentElement.childNodes.forEach((child) =>
        child.classList.remove("selected")
      );
      element.classList.toggle("selected");
    });

    return li;
  }

  selectedElementEvent(element, callback = () => {}) {
    element.addEventListener("click", (event) => {
      callback(element, event);
      element.dispatchEvent(this.onSelectionChange);
    });

    element.addEventListener('dblclick', async event => {
      let filePath = element.dataset?.filepath;
      let type = element.dataset?.type;

      if(filePath && type === 'folder') {
        this.currentFolder = filePath.split('/');
        let lastFolder = this.currentFolder.pop();

        console.log(this.currentFolder, filePath, lastFolder);


        const files = await this.getFilesByFolder(filePath + '/' + lastFolder);

        this.listOfFiles.innerHTML = '';

        files.forEach((file) => {
          const fileData = file.data();
    
          this.appendElement(
            file?.id,
            fileData,
            this.listOfFiles,
            this.btnRename,
            this.btnDelete
          );
        });
      }
    });
  }

  async createFolder(name) {
    const documentRef = `${this.currentFolder.join('/')}/${name}`;

    const folder = {
      filepath: documentRef,
      mimetype: "folder",
      originalFilename: name,
    };

    console.log(folder);


    // return this.firebaseRepository
    //   .set(documentRef, folder);
  }

  async saveOnSnapshot(document, on = () => {}) {
    const file = document?.files["input-file"][0] ?? {};
    return this.firebaseRepository.saveOnSnapshot(file, on);
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
