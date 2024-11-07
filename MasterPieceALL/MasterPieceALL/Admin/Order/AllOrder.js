async function Allorders() {
  const url = "https://localhost:44361/api/Order/GetAllOrder";
  let response = await fetch(url);
  let data = await response.json();
  data.forEach((element) => {
    let Orders = document.getElementById("getorder");
    Orders.innerHTML += `
          <tr>
                    <td>${element.userName}</td>
                    <td>${element.shippingStatus}</td>
                    <td>${element.totalAmount}</td>
                    <td>${element.orderDate}</td>
        </tr> 
         `;
  });
}
Allorders();
