import { Controller } from "stimulus";
import {
  Events,
  FileUploadWithPreview,
} from "../lib/file-upload-with-preview/file-upload-with-preview.cjs.js";
import "../lib/file-upload-with-preview/file-upload-with-preview.min.css";
var upload = {};

export default class extends Controller {
  connect() {
    window.addEventListener(Events.IMAGE_ADDED, (Event) => {
      // var formData = new FormData();
      // formData.append('firstImage', upload.cachedFileArray[0]);
      // Rails.ajax({
      //   type: "post",
      //   url: "/api/v1/products/1/img",
      //   data: formData,
      //   success: (data) => {
      //     console.log(data);
      //   },
      // })
    });

    window.addEventListener(Events.IMAGE_DELETED, (Event) => {
      upload.cachedFileArray;
    });

    upload = new FileUploadWithPreview("myFirstImage", {
      multiple: true,
      text: {
        label: "選擇照片:",
      },
      images: {
        baseImage: "",
      },
      // ,presetFiles: ["https://s.yimg.com/ny/api/res/1.2/SjlAHKRRZKeGTNX7z6yFew--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNg--/https://s.yimg.com/uu/api/res/1.2/1yT2e7805ymUEM6d5ednCA--~B/aD01MzM7dz04MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/nownews.com/372097716213d50c273ccda4594fdee0"]
    });
    const input = document.querySelector(
      "#file-upload-with-preview-myFirstImage"
    );
    input.setAttribute("name", "product[images][]");
    // $('#file-upload-with-preview-myFirstImage').attr("required", "required");
    // $('#file-upload-with-preview-myFirstImage').attr("class", "");
    // $('#file-upload-with-preview-myFirstImage').attr("id", "product_images");
  }
}
