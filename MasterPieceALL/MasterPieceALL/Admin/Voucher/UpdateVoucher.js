async function updatevoucher() {
  // الحصول على قيمة voucherId المخزنة في localStorage
  let voucher = localStorage.getItem("voucherId");

  // تكوين الـ URL مع الـ voucherId
  const url = `https://localhost:44361/api/Vouchers/UpdateVoucher${voucher}`;

  // جمع البيانات من الحقول
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

  // إرسال الطلب باستخدام fetch مع البيانات كـ JSON
  let response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // تعيين نوع المحتوى كـ JSON
    },
    body: JSON.stringify(data), // تحويل الكائن إلى نص JSON
  });

  // التحقق من نجاح العملية
  if (response.ok) {
    alert("Voucher updated successfully");
  } else {
    alert("Failed to update the voucher, please try again.");
  }
}
