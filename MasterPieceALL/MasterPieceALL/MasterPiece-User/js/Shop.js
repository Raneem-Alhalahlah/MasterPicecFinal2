localStorage.removeItem("minnPrice");

let allProducts = [];

async function GetALLProducts() {
  const url = "https://localhost:44361/api/Products/GetAllProducts";
  const response = await fetch(url);
  allProducts = await response.json();
  displayProducts(allProducts); // عرض المنتجات المحملة
}

function displayProducts(products) {
  const container = document.getElementById("allProduct");
  const itemsFoundElement = document.getElementById("itemsFound");

  container.innerHTML = "";
  itemsFoundElement.textContent = `${products.length} Items found`;

  products.forEach((product) => {
    container.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="product-card">
          <div class="image-container">
            <img src="https://localhost:44361/${
              product.productImage1
            }" class="product-image" alt="${product.productName}" />
          </div>
          <div class="card-body">
            <h5 class="card-title">${product.productName}</h5>
            <h6 class="price">${product.price} JD</h6>
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

document.addEventListener("DOMContentLoaded", GetALLProducts); // تحميل المنتجات عند فتح الصفحة

// فلترة المنتجات بالسعر والفئة المخزنة في localStorage
function filterProducts() {
  const minPrice = parseFloat(localStorage.getItem("minPrice")) || 0;
  const maxPrice = parseFloat(localStorage.getItem("maxPrice")) || Infinity;
  const categoryId = localStorage.getItem("categoryId");

  let filteredProducts = allProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  // الفلترة حسب الفئة
  if (categoryId) {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoryId == categoryId
    );
  }

  displayProducts(filteredProducts);
}

// تطبيق فلترة السعر وتخزين القيم في localStorage
document.getElementById("applyFilter").addEventListener("click", function () {
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("maxPrice").value) || Infinity;

  localStorage.setItem("minPrice", minPrice);
  localStorage.setItem("maxPrice", maxPrice);

  filterProducts();
});

// استدعاء الفئات وعرضها ديناميكياً
document.addEventListener("DOMContentLoaded", async function () {
  const apiUrl = "https://localhost:44361/api/Categories/GetAllCategories";
  const response = await fetch(apiUrl);
  const data = await response.json();

  const categoriesList = document.getElementById("category");
  categoriesList.innerHTML = "";

  data.forEach((category) => {
    const categoryItem = `<li><a href="#" class="text-dark category-filter" data-category-id="${category.categoryId}">${category.categoryName}</a></li>`;
    categoriesList.innerHTML += categoryItem;
  });

  // إضافة حدث فلترة المنتجات عند النقر على الفئة
  document.querySelectorAll(".category-filter").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const selectedCategoryId = this.getAttribute("data-category-id");
      localStorage.setItem("categoryId", selectedCategoryId);
      filterProducts(); // فلترة المنتجات بناءً على الفئة المختارة
    });
  });

  filterProducts(); // فلترة المنتجات عند تحميل الصفحة
});

// عند النقر على الزر "View details"
function storeproductId(productId) {
  localStorage.setItem("selectedProductId", productId);
  window.location.href = "Detail.html";
}
//for side bar

const accordionButton = document.querySelector(".accordion-button");
accordionButton.addEventListener("click", function () {
  const accordionCollapse = document.querySelector(
    "#panelsStayOpen-collapseOne"
  );
  accordionCollapse.classList.toggle("show"); // فتح وإغلاق القسم

  // تغيير السهم عند الفتح والإغلاق
  if (accordionCollapse.classList.contains("show")) {
    accordionButton.classList.remove("collapsed"); // سهم للأسفل
  } else {
    accordionButton.classList.add("collapsed"); // سهم للأعلى
  }
});

// استهداف زر الأكوردين الخاص بـ "Filter by Price"
const accordionButtonPrice = document.querySelector(
  ".accordion-button[data-mdb-target='#panelsStayOpen-collapseTwo']"
);

// إضافة حدث النقر على الزر
accordionButtonPrice.addEventListener("click", function () {
  // استهداف القسم الخاص بـ "Filter by Price"
  const accordionCollapsePrice = document.querySelector(
    "#panelsStayOpen-collapseTwo"
  );

  // فتح وإغلاق القسم
  accordionCollapsePrice.classList.toggle("show");

  // تغيير السهم عند الفتح والإغلاق
  if (accordionCollapsePrice.classList.contains("show")) {
    accordionButtonPrice.classList.remove("collapsed"); // سهم للأسفل
  } else {
    accordionButtonPrice.classList.add("collapsed"); // سهم للأعلى
  }
});

// let allProducts = [];

// async function GetALLProducts() {
//   const url = "https://localhost:44361/api/Products/GetAllProducts";
//   const response = await fetch(url);
//   allProducts = await response.json(); // تخزين المنتجات الأصلية

//   // عرض جميع المنتجات عند التحميل
//   displayProducts(allProducts);
// }

// function displayProducts(products) {
//   const container = document.getElementById("allProduct");
//   const itemsFoundElement = document.getElementById("itemsFound");

//   container.innerHTML = ""; // Clear existing content
//   itemsFoundElement.textContent = `${products.length} Items found`;

//   products.forEach((product) => {
//     container.innerHTML += `
//       <div class="col-lg-4 col-md-6 mb-4">
//         <div class="product-card">
//           <div class="image-container">
//             <img src="https://localhost:44361/${
//               product.productImage1
//             }" class="product-image" alt="${product.productName}" />
//           </div>
//           <div class="card-body">
//             <h5 class="card-title">${product.productName}</h5>
//             <h6 class="price">${product.price}    JD</h6>
//             <div class="rating">
//               ${Array.from(
//                 { length: 5 },
//                 (_, i) =>
//                   `<label ${
//                     i < product.rating ? 'style="color: gold;"' : ""
//                   }>&#9733;</label>`
//               ).join("")}
//             </div>
//             <button class="btn btn-primary" onclick="storeproductId(${
//               product.productId
//             })">View details</button>
//           </div>
//         </div>
//       </div>`;
//   });
// }

// GetALLProducts(); // تحميل جميع المنتجات عند التحميل
// function filterByPrice(minPrice, maxPrice) {
//   const filteredProducts = allProducts.filter(
//     (product) => product.price >= minPrice && product.price <= maxPrice
//   );
//   displayProducts(filteredProducts);
// }

// //
// document.getElementById("applyFilter").addEventListener("click", function () {
//   const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
//   const maxPrice =
//     parseFloat(document.getElementById("maxPrice").value) || Infinity;
//   filterByPrice(minPrice, maxPrice);
// });

// //for catsgory
// document.addEventListener("DOMContentLoaded", async function () {
//   const apiUrl = "https://localhost:44361/api/Categories/GetAllCategories"; // قم بتغيير الرابط للرابط الصحيح

//   const response = await fetch(apiUrl);
//   const data = await response.json();

//   const categoriesList = document.getElementById("category");
//   categoriesList.innerHTML = "";

//   data.forEach((category) => {
//     const categoryItem = `<li><a href="#" class="text-dark">${category.categoryName}</a></li>`;
//     categoriesList.innerHTML += categoryItem;
//   });
// });

//اول حل فيه فلاتر
// let allProducts = [];
// let currentCategoryId = null; // تخزين الكاتيجوري المختارة

// async function GetALLProducts() {
//   const url = "https://localhost:44361/api/Products/GetAllProducts";
//   const response = await fetch(url);
//   allProducts = await response.json(); // تخزين جميع المنتجات

//   // عرض جميع المنتجات عند التحميل
//   displayProducts(allProducts);
// }

// function displayProducts(products) {
//   const container = document.getElementById("allProduct");
//   const itemsFoundElement = document.getElementById("itemsFound");

//   container.innerHTML = ""; // مسح المحتوى الحالي
//   itemsFoundElement.textContent = `${products.length} Items found`;

//   products.forEach((product) => {
//     container.innerHTML += `
//       <div class="col-lg-4 col-md-6 mb-4">
//         <div class="product-card">
//           <div class="image-container">
//             <img src="https://localhost:44361/${
//               product.productImage1
//             }" class="product-image" alt="${product.productName}" />
//           </div>
//           <div class="card-body">
//             <h5 class="card-title">${product.productName}</h5>
//             <h6 class="price">${product.price} JD</h6>
//             <div class="rating">
//               ${Array.from(
//                 { length: 5 },
//                 (_, i) =>
//                   `<label ${
//                     i < product.rating ? 'style="color: gold;"' : ""
//                   }>&#9733;</label>`
//               ).join("")}
//             </div>
//             <button class="btn btn-primary" onclick="storeproductId(${
//               product.productId
//             })">View details</button>
//           </div>
//         </div>
//       </div>`;
//   });
// }

// GetALLProducts(); // تحميل جميع المنتجات عند تحميل الصفحة

// // فلترة المنتجات حسب السعر والفئة المختارة
// function filterByPrice(minPrice, maxPrice) {
//   let filteredProducts = allProducts.filter(
//     (product) => product.price >= minPrice && product.price <= maxPrice
//   );

//   // إذا كانت هناك فئة محددة، نقوم بالفلترة حسب الفئة أيضًا
//   if (currentCategoryId) {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.categoryId == currentCategoryId
//     );
//   }

//   displayProducts(filteredProducts);
// }

// // تطبيق فلترة السعر
// document.getElementById("applyFilter").addEventListener("click", function () {
//   const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
//   const maxPrice =
//     parseFloat(document.getElementById("maxPrice").value) || Infinity;
//   filterByPrice(minPrice, maxPrice);
// });

// // استدعاء الفئات وعرضها ديناميكياً
// document.addEventListener("DOMContentLoaded", async function () {
//   const apiUrl = "https://localhost:44361/api/Categories/GetAllCategories"; // رابط API الفئات
//   const response = await fetch(apiUrl);
//   const data = await response.json();

//   const categoriesList = document.getElementById("category");
//   categoriesList.innerHTML = "";

//   data.forEach((category) => {
//     const categoryItem = `<li><a href="#" class="text-dark category-filter" data-category-id="${category.categoryId}">${category.categoryName}</a></li>`;
//     categoriesList.innerHTML += categoryItem;
//   });

//   // إضافة حدث فلترة المنتجات عند النقر على الفئة
//   document.querySelectorAll(".category-filter").forEach((item) => {
//     item.addEventListener("click", function (e) {
//       e.preventDefault();
//       const selectedCategoryId = this.getAttribute("data-category-id");
//       currentCategoryId = selectedCategoryId; // تخزين الفئة المختارة
//       filterByCategory(selectedCategoryId);
//     });
//   });
// });

// // فلترة المنتجات حسب الفئة
// function filterByCategory(categoryId) {
//   const filteredProducts = allProducts.filter(
//     (product) => product.categoryId == categoryId
//   );
//   displayProducts(filteredProducts);
// }
// for profile and logout icon
function renderUserLinks() {
  const userId = localStorage.getItem("userId");
  const userLinksContainer = document.getElementById("userLinks");
  const logoutButton = document.getElementById("logoutButton");

  if (userId) {
    // عند تسجيل الدخول، يظهر رابط "Profile" بدلاً من "Account"
    userLinksContainer.innerHTML = `
          <a href="Profile-page.html" class="nav-item nav-link">Profile</a>
      `;
    // يظهر زر تسجيل الخروج
    logoutButton.style.display = "block";
  } else {
    // عند عدم تسجيل الدخول، يظهر رابط "Account"
    userLinksContainer.innerHTML = `
          <a href="Account-page.html" class="nav-item nav-link">Account</a>
      `;
    // يخفي زر تسجيل الخروج
    logoutButton.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("Token");
  renderUserLinks();
  window.location.href = "Account-page.html";
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", renderUserLinks);
//ايقونة الكارت
async function getnumber() {
  let userId = localStorage.getItem("userId");
  var urlemployee = `https://localhost:44361/api/Cart/CartItemCount/${userId}`;
  try {
    var response = await fetch(urlemployee);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    var data = await response.json();
    var container = document.getElementById("cart-count");
    container.innerHTML = data;
    console.log(data);
  } catch (error) {
    console.error("Error fetching cart item count:", error);
  }
}
getnumber();
