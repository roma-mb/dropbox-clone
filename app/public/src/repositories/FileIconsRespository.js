import { icons } from "./icons.js";

export default class FileIconsRespository {
  getIconByType(type) {
    return icons[type] ?? icons["default"];
  }
}
