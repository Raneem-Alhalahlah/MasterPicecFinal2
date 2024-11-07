async function getAllUsers() {
  try {
    const response = await fetch(
      "https://localhost:44361/api/User/ShowAllUsers"
    );
    const users = await response.json();

    const userContainer = document.getElementById("table-container");
    userContainer.innerHTML = ""; // Clear the current items

    // Create table rows for users
    users.forEach((user) => {
      userContainer.innerHTML += `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
          </tr>
        `;
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Call the function to fetch and display users
getAllUsers();
