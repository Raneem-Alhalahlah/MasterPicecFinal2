// عرض بيانات المستخدم في النموذج
document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("No user ID found in local storage.");
    return;
  }

  const data = await fetchUserData(userId);
  populateForm(data);
});

// دالة لجلب بيانات المستخدم
async function fetchUserData(userId) {
  const response = await fetch(
    `https://localhost:44361/api/User/ShowUserByID/${userId}`
  );
  if (!response.ok) {
    alert("Failed to fetch user data.");
    return;
  }
  return response.json();
}

function populateForm(data) {
  document.getElementById("fname").value = data.firstName;
  document.getElementById("lname").value = data.lastName;
  document.getElementById("username").value = data.userName;
  document.getElementById("email").value = data.email;
  document.getElementById("phonenum").value = data.phoneNumber;
  document.getElementById("address").value = data.address;

  // عرض صورة المستخدم الحالية
  if (data.userImage) {
    const imageUrl = `https://localhost:44361/${data.userImage}`;
    document.getElementById("profileImage").src = imageUrl;
  }
}

// حفظ التغييرات وتحديث بيانات المستخدم
async function saveChanges(event) {
  event.preventDefault(); // منع إعادة تحميل الصفحة

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("No user ID found in local storage.");
    return;
  }

  const formData = new FormData();
  formData.append("FirstName", document.getElementById("fname").value);
  formData.append("LastName", document.getElementById("lname").value);
  formData.append("UserName", document.getElementById("username").value);
  formData.append("Email", document.getElementById("email").value);
  formData.append("PhoneNumber", document.getElementById("phonenum").value);
  formData.append("Address", document.getElementById("address").value);

  // إذا تم اختيار صورة جديدة، قم برفعها
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    formData.append("UserImage", fileInput.files[0]);
  }

  // تحديث بيانات المستخدم
  const response = await fetch(
    `https://localhost:44361/api/User/UpdateUser/${userId}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (response.ok) {
    alert("User data updated successfully.");
  } else {
    alert("Failed to update user data.");
  }
}

// // حذف الحساب
// function deleteAccount() {
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     alert("No user ID found in local storage.");
//     return;
//   }

//   const confirmation = confirm(
//     "Are you sure you want to delete your account? This action cannot be undone."
//   );
//   if (!confirmation) {
//     return; // إذا لم يؤكد المستخدم، أوقف العملية
//   }

//   fetch(`https://localhost:44361/api/User/DeleteUser/${userId}`, {
//     method: "DELETE",
//   })
//     .then((response) => {
//       if (response.ok) {
//         alert("Account deleted successfully.");
//         localStorage.removeItem("userId");
//         window.location.href = "Account-page.html";
//       } else {
//         alert("Failed to delete account.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error deleting user account:", error);
//       alert("An error occurred while deleting the account.");
//     });
// }
