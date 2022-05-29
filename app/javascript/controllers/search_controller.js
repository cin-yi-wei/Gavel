import { Controller } from "stimulus";
import Rails from "@rails/ujs";
import { createElement } from "react";
export default class extends Controller {
  static targets = ["query", "product"];

  search(e) {
    e.preventDefault();

    Rails.ajax({
      url: `api/v1/products/search/${this.queryTarget.value}`,
      type: "GET",
      data: JSON,
      success: (resp) => {
        const search = document.querySelector("#search");
        search.textContent = "";
        resp.forEach(function (i) {
          let {
            name,
            description,
            status,
            direct_price,
            start_price,
            product_image,
          } = i;
          let getDataList = `
                              <div class="search bg-gray-200 m-4 p-2">
                              <img src="${product_image}" class="search text-gray-700">
                              <p class="search font-extrabold">${name}</p>
                              <p class="search text-gray-700">${description}</p>
                              <p class="search text-gray-700">${status}</p>
                              <p class="search text-gray-700">${start_price}</p>
                              <p class="search text-gray-700">${direct_price}</p>
                              </div>
                              `;
          search.insertAdjacentHTML("afterbegin", getDataList);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
