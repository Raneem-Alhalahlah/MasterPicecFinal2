async function ShowVoucher() {
  let url = "https://localhost:44361/api/Vouchers/GetVoucher";
  let response = await fetch(url);
  let data = await response.json();
  data.forEach((element) => {
    let voucherDiv = document.getElementById("container");
    voucherDiv.innerHTML += `
      <tr>
                <td>${element.voucherCode}</td>
                <td>${element.discountPercentage}</td>
                 <td>${element.startDate}</td>
                <td>${element.endDate}</td>
                <td>${element.isActive}</td>
                <td><button class="btn btn-warning" onclick="editVoucherId(${element.voucherId})"><a href="../Voucher/UpdateVoucher.html">Edit</a></button>
                <button class="btn btn-danger"  onclick="deleteVoucher(${element.voucherId})">Delete</button>
                </td>
    </tr> 
     `;
  });
}
ShowVoucher();

function editVoucherId(id) {
  localStorage.setItem("voucherId", id);
}

async function deleteVoucher(id) {
  const url = `https://localhost:44361/api/Vouchers/DeletVoucher${id}`;
  let response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  alert("Voucher removed successfully");
  location.reload();
}
