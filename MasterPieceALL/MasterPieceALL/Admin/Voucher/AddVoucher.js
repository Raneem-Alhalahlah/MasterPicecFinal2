async function addvoucher() {
  // جمع القيم من الفورم مباشرة
  let voucherCode = document.getElementById("code").value;
  let discountPercentage = document.getElementById("discountPercentage").value;
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("expirationDate").value;
  let isActive = document.getElementById("isActive").value;

  // إنشاء كائن JSON يحتوي على بيانات الفورم
  let data = {
    voucherCode: voucherCode,
    discountPercentage: discountPercentage,
    startDate: startDate,
    endDate: endDate,
    isActive: isActive,
  };

  // إرسال البيانات باستخدام fetch
  let response = await fetch(
    "https://localhost:44361/api/Vouchers/AddVoucher",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (response.ok) {
    alert("Voucher added successfully");
  } else {
    alert("Failed to add the voucher, please try again.");
  }
}
