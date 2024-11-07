const url = "https://localhost:44361/api/contact/AddMessage";
var form = document.getElementById("ContactForm");
async function sendMessage() {
  event.preventDefault();
  var formData = new FormData(form);
  let response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  var data = response;
  if (response.ok) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Message sent successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    form.reset(); // إعادة تعيين النموذج بعد نجاح الإرسال
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Failed to send message",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
