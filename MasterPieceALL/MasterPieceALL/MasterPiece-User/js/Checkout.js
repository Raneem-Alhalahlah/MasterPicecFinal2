document.addEventListener("DOMContentLoaded", async function () {
  // جلب userId من localStorage
  let userId = localStorage.getItem("userId");

  // تحقق من أن userId موجود في localStorage
  if (!userId) {
    console.error("User ID not found in localStorage");
    return; // إذا لم يكن userId موجود، وقف التنفيذ
  }

  const apiUrl = `https://localhost:44361/api/User/ShowUserByID/${userId}`;

  try {
    // جلب البيانات باستخدام async/await
    const response = await fetch(apiUrl);
    const data = await response.json();

    // تعبئة الحقول بالبيانات المأخوذة من الـ API
    document.getElementById("firstName").value = data.firstName;
    document.getElementById("lastName").value = data.lastName;
    document.getElementById("phone").value = data.phoneNumber;
    document.getElementById("email").value = data.email;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// //Adress
// async function addAdress() {
//   // جلب قيم المدخلات من الـ DOM
//   const country = document.getElementById("country").value;
//   const city = document.getElementById("city").value;
//   const street = document.getElementById("street").value;
//   const postalCode = document.getElementById("postalCode").value;

//   // استرجاع الـ UserId من local storage
//   const userId = localStorage.getItem("userId"); // تأكد من أن الـ userId محفوظ في الـ local storage

//   // التحقق من أن جميع الحقول معبأة
//   if (!country || !city || !street || !postalCode || !userId) {
//     alert("Please fill in all fields.");
//     return;
//   }

//   // إعداد البيانات للإرسال
//   const addressData = {
//     UserId: parseInt(userId),
//     Country: country,
//     City: city,
//     Street: street,
//     PostalCode: postalCode,
//   };

//   try {
//     const response = await fetch(
//       "https://localhost:44361/api/AdressUser/AddUserAdress",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(addressData),
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();
//       alert("Address saved successfully!");
//       console.log(data);
//     } else {
//       const errorData = await response.json();
//       alert(`Error: ${errorData.message}`);
//     }
//   } catch (error) {
//     console.error("Error submitting address:", error);
//     alert("There was an error submitting your address.");
//   }
// }

//add and update Adress
async function addAdress() {
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value;
  const street = document.getElementById("street").value;
  const postalCode = document.getElementById("postalCode").value;

  const userId = localStorage.getItem("userId");
  var finalprice = localStorage.getItem("discountedTotalPrice");

  // التحقق من أن جميع الحقول معبأة
  if (!country || !city || !street || !postalCode || !userId) {
    alert("Please fill in all fields.");
    return;
  }

  // إعداد البيانات للإرسال
  const addressData = {
    UserId: parseInt(userId),
    Country: country,
    City: city,
    Street: street,
    PostalCode: postalCode,
  };

  try {
    const checkResponse = await fetch(
      `https://localhost:44361/api/AdressUser/GetUserAddressByUserId/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const existingAddress = checkResponse.ok
      ? await checkResponse.json()
      : null;

    if (!existingAddress || Object.keys(existingAddress).length === 0) {
      // إذا لم يكن لدى المستخدم عنوان، قم بإنشاء عنوان جديد
      const response = await fetch(
        "https://localhost:44361/api/AdressUser/AddUserAdress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(addressData),
        }
      );

      const message = response.ok
        ? "Address saved successfully!"
        : "Error saving address.";
      alert(message);
    } else {
      // إذا كان لدى المستخدم عنوان، قم بتحديثه
      const response = await fetch(
        `https://localhost:44361/api/AdressUser/UpdateUserAddressByUserId/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(addressData),
        }
      );

      const message = response.ok
        ? "Address updated successfully!"
        : "Error updating address.";
      alert(message);
      window.location.href = "payment.html";
    }
  } catch (error) {
    console.error("Error submitting address:", error);
    alert("There was an error submitting your address.");
  }
}
