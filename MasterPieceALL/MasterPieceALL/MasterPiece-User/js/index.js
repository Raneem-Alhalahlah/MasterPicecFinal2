async function loadCategories() {
  const response = await fetch(
    "https://localhost:44361/api/Categories/GetAllCategories"
  );
  const data = await response.json();

  const container = document.getElementById("categorySection");
  container.innerHTML = ""; // مسح المحتوى القديم قبل إضافة العناصر الجديدة
  data.forEach((category) => {
    container.innerHTML += `
        <div class="col-lg-6">
          <div class="services-item bg-light border-4 border-start border-primary rounded p-4" onclick="goToShop(${category.categoryId})">
            <div class="row align-items-center">
              <div class="col-4">
                <div class="services-img d-flex align-items-center justify-content-center rounded">
                  <img src="https://localhost:44361/${category.categoryImage}" class="img-fluid rounded" alt="${category.categoryName}" />
                </div>
              </div>
              <div class="col-8">
                <div class="services-content text-start">
                  <h3>${category.categoryName}</h3>
                  <p>${category.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  });
}

function goToShop(categoryId) {
  debugger;
  localStorage.setItem("categoryId", categoryId);
  window.location.href = "Shop.html";
}

document.addEventListener("DOMContentLoaded", loadCategories);

//last product section
async function GetLatestProducts() {
  const url = "https://localhost:44361/api/Products/GetLatestProducts";
  const response = await fetch(url);
  const products = await response.json();

  const container = document.getElementById("lastProduct");
  container.innerHTML = ""; // Clear existing content

  products.forEach((product) => {
    container.innerHTML += `
        <div class="col-lg-4 col-md-12 mb-4">
          <div class="card-secetion-BestSeller">
            <div class="bg-image hover-zoom">
              <img src="https://localhost:44361/${
                product.productImage1
              }" class="w-100" alt="${product.productName}" />
              <div class="d-flex justify-content-start align-items-end h-100">
                <h5><span class="badge bg-primary ms-2">New</span></h5>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title mb-3">${product.productName}</h5>
              <h6 class="mb-3">${product.price} JD</h6>
              <div class="rating">
                ${Array.from(
                  { length: 5 },
                  (_, i) =>
                    `<label ${
                      i < product.rating ? 'style="color: gold;"' : ""
                    }>&#9733;</label>`
                ).join("")}
              </div>
              <button class="btn btn-primary" onclick="storeproductId(${
                product.productId
              })">View details</button>
            </div>
          </div>
        </div>`;
  });
}

function storeproductId(productId) {
  localStorage.setItem("selectedProductId", productId);

  window.location.href = "Detail.html";
}

GetLatestProducts();

//Top product section
async function TopProducts() {
  const url = "https://localhost:44361/api/Products/productsWithRatings";
  const response = await fetch(url);
  const products = await response.json();

  const container = document.getElementById("bestSeller");
  container.innerHTML = ""; // Clear existing content

  products.forEach((product) => {
    container.innerHTML += `
          <div class="col-lg-4 col-md-12 mb-4">
            <div class="card-secetion-BestSeller">
              <div class="bg-image hover-zoom">
              
               
                <img src="https://localhost:44361/${
                  product.productImage1
                }" class="w-100" alt="${product.productName}" />
                <div
                        class="d-flex justify-content-start align-items-end h-100"
                      >
<h5><span class="badge bg-success ms-2">Top</span></h5>
                      </div>
              </div>
              <div class="card-body">
                <h5 class="card-title mb-3">${product.productName}</h5>
                <h6 class="mb-3">${product.price}    JD</h6>
                <div class="rating">
                  ${Array.from(
                    { length: 5 },
                    (_, i) =>
                      `<label ${
                        i < product.rating ? 'style="color: gold;"' : ""
                      }>&#9733;</label>`
                  ).join("")}
                </div>
                <button class="btn btn-primary" onclick="storeproductId(${
                  product.productId
                })">View details</button>
              </div>
            </div>
          </div>`;
  });
}
TopProducts();
