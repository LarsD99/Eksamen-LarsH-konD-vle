const apiUrl =
  "https://crudcrud.com/api/ddc6bef7d86949ab891f507545c1844b/users";

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    fetch(apiEndpoint)
      .then(function (response) {
        console.log("Login request status:", response.status);
        return response.json();
      })
      .then(function (users) {
        const matchingUser = users.find(function (user) {
          return (
            user.username === enteredUsername &&
            user.password === enteredPassword
          );
        });

        if (matchingUser) {
          localStorage.setItem("currentUser", JSON.stringify(matchingUser));
          alert("Login successful!");
          window.location.href = "datingApp.html";
        } else {
          alert("Invalid username or password.");
        }
      })
      .catch(function (error) {
        console.error("Error checking login:", error);
      });
  });
