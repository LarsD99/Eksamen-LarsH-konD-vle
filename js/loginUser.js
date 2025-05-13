const apiEndpoint =
  "https://crudcrud.com/api/59bd4a25395f4afca8a59d97f014ccb6/users";

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
