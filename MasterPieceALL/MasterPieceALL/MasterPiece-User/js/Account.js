async function Register(event) {
  event.preventDefault();
  let url = "https://localhost:44361/api/User/RegisterUsers";

  const formData = new FormData(document.getElementById("signupForm"));

  var password = formData.get("Passwword");
  var repeatPassword = formData.get("repeatpassword");

  if (password !== repeatPassword) {
    alert(
      "Passwords do not match. Please make sure both passwords are the same."
    );
    return;
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (response.ok) {
    console.log("Register successful:", result);
    alert("Registration Successful ,Pleas login now");
    window.location.href = "Account-page.html";
  } else {
    console.error("Registration failed:", result);
    alert("Please Enter a Valid Email or Password");
  }
}

let loginnForm = document.getElementById("loginnForm");
let loginUrl = "https://localhost:44361/api/User/LoginUsers";

loginnForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // منع إعادة تحميل الصفحة

  var formdata = new FormData(loginnForm); // جمع بيانات الفورم

  // عرض البيانات في الكونسول للتأكد من الحصول عليها بشكل صحيح
  formdata.forEach((value, key) => console.log(key, value));

  try {
    // إرسال الطلب إلى الـAPI
    const response = await fetch(loginUrl, {
      method: "POST",
      body: formdata,
    });

    const result = await response.json(); // تحويل الاستجابة إلى JSON

    if (response.ok) {
      // حفظ التوكن وبيانات المستخدم في الـlocalStorage
      localStorage.setItem("Token", result.token);
      localStorage.setItem("userId", result.user.userId);

      console.log("Login successful:", result);
      alert("Login Successful");
      window.location.href = "index.html";
      saveLocalCartItemToApi(); // توجيه المستخدم إلى الصفحة الرئيسية
    } else {
      console.error("Login failed:", result);
      alert("Please Enter a Valid Email or Password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login. Please try again later.");
  }
});

async function saveLocalCartItemToApi() {
  let cartItems = localStorage.cartItems;
  if (cartItems) {
    cartItems = JSON.parse(cartItems);
    for (cartItem of cartItems) {
      await addToCart(cartItem);
    }
  }
}

async function addToCart(cartItem) {
  let token = localStorage.Token;
  await fetch("https://localhost:44361/api/Cart/addToCart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartItem),
  });
}
