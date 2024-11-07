// // Initialize the PayPal button
// const storedPrice = localStorage.getItem("discountedTotalPrice") || "0.99"; // Default value if not found

// // Update the price display on the page
// document.getElementById("priceDisplay").textContent = `$${storedPrice}`;

// function initPayPalButton() {
//   paypal
//     .Buttons({
//       style: {
//         shape: "rect",
//         color: "gold",
//         layout: "vertical",
//         label: "paypal",
//       },

//       createOrder: function (data, actions) {
//         // Use the price from localStorage for the purchase
//         return actions.order.create({
//           purchase_units: [
//             {
//               amount: {
//                 currency_code: "USD",
//                 value: storedPrice, // Dynamic value from localStorage
//               },
//             },
//           ],
//         });
//       },

//       onApprove: function (data, actions) {
//         return actions.order.capture().then(function (orderData) {
//           // Full available details
//           console.log(
//             "Capture result",
//             orderData,
//             JSON.stringify(orderData, null, 2)
//           );

//           // Show a success message within this page
//           const element = document.getElementById("paypal-button-container");
//           element.innerHTML = "";
//           element.innerHTML = "<h3>Thank you for your payment!</h3>";

//           // Or go to another URL:  actions.redirect('thank_you.html');
//         });
//       },

//       onError: function (err) {
//         console.log(err);
//       },
//     })
//     .render("#paypal-button-container");
// }

// // Call the function to initialize the PayPal button
// initPayPalButton();

// Initialize the PayPal button
// Initialize the PayPal button
const storedPrice = localStorage.getItem("discountedTotalPrice"); // Attempt to get the discounted price
const totalPrice = localStorage.getItem("totalPrice"); // Get the total price
const orderId = localStorage.getItem("orderId"); // Retrieve OrderId from localStorage

// Determine the price to use for the payment
let priceToUse = storedPrice || totalPrice || "0.00"; // Default value if none found

// Update the price display on the page
document.getElementById("priceDisplay").textContent = `$${priceToUse}`;

function initPayPalButton() {
  paypal
    .Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "vertical",
        label: "paypal",
      },

      createOrder: function (data, actions) {
        // Use the determined price for the purchase
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: priceToUse, // Dynamic value from localStorage or default
              },
            },
          ],
        });
      },

      onApprove: function (data, actions) {
        return actions.order.capture().then(async function (orderData) {
          // Full available details
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2)
          );

          // Show a success message within this page
          const element = document.getElementById("paypal-button-container");
          element.innerHTML = "";
          element.innerHTML =
            "<h3 style='color: #ff4f9d;'>Thank you for your payment!</h3>";

          // Check if orderId exists and process the payment
          if (orderId) {
            const paymentData = {
              OrderId: parseInt(orderId), // Convert OrderId to integer
              Amount: parseFloat(priceToUse), // Convert price to decimal
            };

            // Make a POST request to process payment
            try {
              const response = await fetch(
                "https://localhost:44361/api/Payments/processPayment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(paymentData),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to process payment.");
              }

              const responseData = await response.text();
              console.log("Payment processed successfully:", responseData);
              localStorage.removeItem("totalPrice");
              localStorage.removeItem("discountedTotalPrice");
            } catch (error) {
              console.error("Error processing payment:", error);
              alert("There was an error processing your payment.");
            }
          } else {
            alert("Order ID not found.");
          }
        });
      },

      onError: function (err) {
        console.log(err);
      },
    })
    .render("#paypal-button-container");
}

// Call the function to initialize the PayPal button
initPayPalButton();
