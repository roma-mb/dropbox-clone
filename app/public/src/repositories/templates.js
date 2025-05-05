const navSpan = (href, folderFilePath, folder) => {
  return `
        <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
          <a href="${href}" data-path="${folderFilePath}" class="breadcrumb-segment">${folder}</a>
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="mc-icon-template-stateless"
          style="top: 4px; position: relative"
        >
          <title>arrow-right</title>
          <path
            d="M10.414 7.05l4.95 4.95-4.95 4.95L9 15.534 12.536 12 9 8.464z"
            fill="#637282"
            fill-rule="evenodd"
          ></path>
        </svg>`;
};

const templateDefault = () => {
  return `
        <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
          <a href="#" data-path="files" class="breadcrumb-segment">Files</a>
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="mc-icon-template-stateless"
          style="top: 4px; position: relative"
        >
          <title>arrow-right</title>
          <path
            d="M10.414 7.05l4.95 4.95-4.95 4.95L9 15.534 12.536 12 9 8.464z"
            fill="#637282"
            fill-rule="evenodd"
          ></path>
        </svg>`;
};

const templates = {
  default: templateDefault,
  navSpan,
};

export { templates };
