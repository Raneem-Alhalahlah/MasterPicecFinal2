async function Allpayment() {
  const url = "https://localhost:44361/api/Payments/GetPayment";
  let response = await fetch(url);
  let data = await response.json();
  data.forEach((element) => {
    let Orders = document.getElementById("getorder");
    Orders.innerHTML += `
            <tr>
                      <td>${element.orderId}</td>
                      <td>${element.amount}</td>
                      <td>${element.paymentDate}</td>
          </tr> 
           `;
  });
}
Allpayment();
