function saveAndRedirect(productName) {
  localStorage.setItem("ProductName", productName);
  window.location.href = "AdventureColor.html";
}
