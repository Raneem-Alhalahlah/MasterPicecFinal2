async function savePriceRange(maxxPrice, minnPrice) {
  // تخزين السعر الأدنى والأعلى في localStorage

  localStorage.setItem("maxxPrice", maxxPrice);
  localStorage.setItem("minnPrice", minnPrice);

  // استرجاع القيم المحفوظة
  const savedMaxPrice = localStorage.getItem("maxxPrice");
  const savedMinPrice = localStorage.getItem("minnPrice");
  const savedProductName = localStorage.getItem("ProductName");
  const savedColor = localStorage.getItem("colorName");

  // إنشاء كائن يحتوي على جميع القيم المسترجعة
  const productDetails = {
    productName: savedProductName,
    color: savedColor,
    minPrice: savedMinPrice,
    maxPrice: savedMaxPrice,
  };

  try {
    const response = await fetch(
      `https://localhost:44361/api/Products/visible`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetails),
      }
    );

    console.log("Product Details:", response);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }

    const data = await response.json();
    console.log("Data from API:", data);

    // الانتقال إلى صفحة التفاصيل بعد نجاح العملية
    window.location.href = "Detail.html";
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
