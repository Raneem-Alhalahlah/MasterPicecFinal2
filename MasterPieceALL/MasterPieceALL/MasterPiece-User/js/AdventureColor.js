function saveAndRedirect(color) {
  localStorage.setItem("colorName", color);
  window.location.href = "AdventurePrice.html";
}
localStorage.removeItem("selectedProductId");
