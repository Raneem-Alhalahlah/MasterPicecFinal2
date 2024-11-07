async function showProductDetail() {
  const x = localStorage.getItem("selectedProductId");
  let min = localStorage.getItem("minnPrice");
  let response;
  if (min != null || min != undefined) {
    const productDetails = {
      productName: localStorage.getItem("ProductName"),
      color: localStorage.getItem("colorName"),
      minPrice: localStorage.getItem("minnPrice"),
      maxPrice: localStorage.getItem("maxxPrice"),
    };

    response = await fetch(`https://localhost:44361/api/Products/visible`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productDetails),
    });
  } else {
    let url = `https://localhost:44361/api/Products/GetProductsById/${x}`;
    response = await fetch(url);
  }

  let result = await response.json();
  localStorage.setItem("selectedProductId", result.productId);
  var container = document.getElementById("productdetails");

  container.innerHTML = `<div class="container">
    <div class="row gx-5">
        <aside class="col-lg-6">
            <div>
                <img 
                    style="max-width: 90%; max-height: 90vh; margin: auto; border-radius: 15px;" 
                    class="fit" 
                    src="https://localhost:44361/${result.productImage1}" 
                />
            </div>
        </aside>

        <main class="col-lg-6">
            <div class="ps-lg-3">
                <h3 class="title text-dark">
                    <i class="fas fa-tags me-2" style="color: #ff69b4; font-size: 0.6em;"></i>
                    ${result.productName}
                </h3>
                
                <p class="text-muted" style="font-size: 1.1em;">
                    <i class="fas fa-info-circle me-2" style="color: #ff69b4;"></i>
                    <strong>${result.description}</strong>
                </p>                

 
                <div class="row my-3" style="font-size: 1.1em;">
                    <dt class="col-3"><i class="fas fa-paint-brush me-1" style="color: #ff69b4;"></i>Color:</dt>
                    <dd class="col-9">${result.color}</dd>
                </div>
                
                <div class="row my-3" style="font-size: 1.1em;">
                    <dt class="col-3">
                        <i class="fas fa-check-circle me-1" style="color: #ff69b4;"></i>
                        In stock:
                    </dt>
                    <ddd class="col-9 text-success">
                        ${
                          result.stockQuantity > 0
                            ? "Available"
                            : "Out of stock"
                        }
                    </ddd>
                    
                </div>

                <div class="row my-3" style="font-size: 1.1em;">
                    <dt class="col-3">
                        <i class="fas fa-money-bill-wave me-1" style="color: #ff69b4;"></i>
                        Price:
                    </dt>
                    <dddd class="col-9 text-black">
                        ${result.price} JOD
                    </dddd>
                </div>

                <hr>
                <div class="row mb-4">
                    <div class="col-md-4 col-6 mb-3">
                        <label class="mb-2 d-block" style="font-size: 1.5em;">Quantity :</label>
                        <div class="input-group mb-3" style="width: 170px">
                            <button class="btn btn-white border border-secondary px-3" type="button" id="button-addon1" onclick="reduceToQuantity()">
                                <i class="fas fa-minus" style="color: #ff69b4;"></i>
                            </button>
                            <input type="text" class="form-control text-center border border-secondary" value="1" id="quantity" />
                            <button class="btn btn-white border border-secondary px-3" type="button" id="button-addon2" onclick="addToQuantity()">
                                <i class="fas fa-plus" style="color: #ff69b4;"></i>
                            </button>
                        </div>
                    </div>
                    
                </div>

                <a class="btn btn-primary shadow-0" onclick="addToCart(${
                  localStorage.selectedProductId
                })">
                    <i class="me-1 fa fa-shopping-basket"></i> Add to cart
                </a>
            </div>
        </main>
    </div>
</div>


`;
}

showProductDetail();

async function addToCart(productId) {
  const token = localStorage.getItem("Token");
  const quantity = parseInt(document.getElementById("quantity").value, 10);

  if (token) {
    try {
      const response = await fetch(
        "https://localhost:44361/api/Cart/addToCart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity,
          }),
        }
      );
      // location.reload();
      const data = await response.json();
      console.log("Product added to cart:", data);
      await getnumber();
      Toastify({
        text: `Your product has been added to the cart successfully!`,
        duration: 3000,
        backgroundColor: "green",
        position: "center",
      }).showToast();
    } catch (error) {
      console.error("Error:", error);
      Toastify({
        text: "Error adding product to the cart ",
        duration: 3000,
        backgroundColor: "red",
        position: "center",
      }).showToast();
    }
  } else {
    // إذا لم يكن هناك توكين، احفظ المنتج والكمية في localStorage
    let cartItems = localStorage.getItem("cartItems");
    if (cartItems) cartItems = JSON.parse(cartItems);
    else cartItems = [];

    if (cartItems.find((c) => c.productId == productId)) {
      cartItems.find((c) => c.productId == productId).quantity += quantity;
    } else {
      cartItems.push({ productId: productId, quantity: quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    await getnumber();
    Toastify({
      text: `Please Login first `,
      duration: 3000,
      position: "center",
      backgroundColor: "Blue",
    }).showToast();
  }
}
const urlBatool = "https://localhost:44361/api/Cart/updateCartItem";
async function updateData(cartItemId, quantity) {
  const token = localStorage.getItem("Token");

  var response = await fetch(`${urlBatool}/${cartItemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity: quantity,
    }),
  });

  if (response.ok) {
    var result = await response.json();
    console.log("Updated cart item:", result);
  } else {
    console.error("Error updating cart item:", await response.text());
  }
}
function addToQuantity() {
  document.getElementById("quantity").value =
    +document.getElementById("quantity").value + 1;
  updateData(cartItemId, quantityInput.value);
}
function reduceToQuantity() {
  if (document.getElementById("quantity").value > 1)
    document.getElementById("quantity").value =
      +document.getElementById("quantity").value - 1;
  updateData(cartItemId, quantityInput.value);
}

//for rating
