import FileManagerService from "../services/FileManagerService.js";
import Utils from "../helpers/Utils.js";

export default class FileManagerController {
  constructor() {
    this.fileManagerService = new FileManagerService();
    this.btnSendFile = document.getElementById("btn-send-file");
    this.files = document.getElementById("files");
    this.snackBar = document.getElementById("react-snackbar-root");
    this.progressbar = this.snackBar.querySelector(".mc-progress-bar-fg");
    this.fileName = this.snackBar.querySelector(".filename");
    this.timeLeft = this.snackBar.querySelector(".timeleft");
    this.listOfFiles = document.getElementById("list-of-files-and-directories");

    this.btnNewFolder = document.getElementById("btn-new-folder");
    this.btnRename = document.getElementById("btn-rename");
    this.btnDelete = document.getElementById("btn-delete");

    this.loadFiles();
    this.#loadEvents();
  }

  #loadEvents() {
    this.btnSendFile.addEventListener("click", event => {
      this.files.click();
    });

    this.files.addEventListener("change", event => {
      this.sendFiles(event.target.files);
      Utils.displayElement(this.snackBar);
    });

    this.btnNewFolder.addEventListener("click", event => {
      let name = prompt("Enter the folder name.");

      if (name) {
        this.fileManagerService
          .createFolder(name)
          .then((data) => console.log(data))
          .catch((error) => console.error(error));
      }
    });

    this.btnRename.addEventListener("click", async event => {
      const element = this.listOfFiles.querySelectorAll(".selected")[0];
      const id = element?.dataset?.key;
      const name = element?.dataset.name;

      if (!(id && name)) {
        return;
      }

      let originalFilename = prompt("Rename the file:", name);

      await this.fileManagerService
        .updateFile(id, { originalFilename })
        .then((data) => location.reload())
        .catch((error) => console.error(error));
    });

    this.btnDelete.addEventListener("click", async event => {
      let files = [];

      this.listOfFiles.querySelectorAll(".selected").forEach((element) => {
        files.push(element.dataset.key);
      });

      await this.fileManagerService
        .deleteFiles(files)
        .then((data) => location.reload())
        .catch((error) => console.error(error));
    });
  }

  async sendFiles(files) {
    let startTime = Date.now();

    let progressElement = (event) => {
      const { percentProgress, timeLeft } =
        this.fileManagerService.calcProgressBar(event, startTime);
      const { seconds, minutes, hours } = Utils.getTimeByMiliseconds(timeLeft);

      this.progressbar.style.width = `${percentProgress}%`;
      this.timeLeft.textContent = Utils.formatTimeLeft(hours, minutes, seconds);
    };

    let fileOutput = (file) =>
      (this.fileName.textContent += `${file?.name ?? ""} `);
    let uploadedFiles = await this.fileManagerService.uploadFiles(
      files,
      progressElement,
      fileOutput
    );

    Utils.displayElement(this.snackBar);

    if (!uploadedFiles) {
      console.error(uploadedFiles);
      return;
    }

    uploadedFiles.forEach(async (file) => {
      this.fileManagerService.saveOnSnapshot(file, (onSnapshot) => {
        const fileData = onSnapshot.data();

        this.fileManagerService.appendElement(
          onSnapshot?.id,
          fileData,
          this.listOfFiles,
          this.btnRename,
          this.btnDelete
        );
      });
    });

    this.fileName.value = "";
  }

  async loadFiles() {
    const files = await this.fileManagerService.getFiles();

    files.forEach((file) => {
      const fileData = file.data();

      this.fileManagerService.appendElement(
        file?.id,
        fileData,
        this.listOfFiles,
        this.btnRename,
        this.btnDelete
      );
    });
  }
}
