import FileManagerService from '../services/FileManagerService.js';

export default class FileManagerController {
  constructor() {
    this.fileManagerService = new FileManagerService();

    this.#loadFiles();
  }

  #loadFiles() {
    this.fileManagerService.loadFiles();
  }
}
