async function getAllCategory() {
  let request = await fetch(
    "https://localhost:44361/api/Categories/GetAllCategories"
  );
  let data = await request.json();

  var CategoryId = document.getElementById("CategoryId");

  data.forEach((element) => {
    CategoryId.innerHTML += `
    <option value="${element.categoryId}">${element.categoryName}</option>

    `;
  });
}
getAllCategory();

var x = localStorage.getItem("productId");
const url = `https://localhost:44361/api/Products/UpdateProduct/${x}`;

var form = document.getElementById("form");
async function updateProduct() {
  event.preventDefault();
  var formData = new FormData(form);

  var response = await fetch(url, {
    method: "PUT",
    body: formData,
  });

  alert("Product updated Successfully");
}
