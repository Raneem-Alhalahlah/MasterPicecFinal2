function loginAdmin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = new URLSearchParams({
    Email: email,
    Password: password,
  }).toString();

  fetch("https://localhost:44361/api/Admin/LoginAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  }).then((response) => {
    alert(response.ok ? "Login successful!" : "Login failed!");
    if (response.ok) window.location.href = "/Admin/index1.html";
  });
}
