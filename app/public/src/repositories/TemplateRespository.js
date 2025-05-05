import { templates } from "./templates.js";

export default class TemplateRespository {
  get(name) {
    return templates[name] ?? templates["default"];
  }
}
