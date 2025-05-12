const apiEndpoint =
  "https://crudcrud.com/api/59bd4a25395f4afca8a59d97f014ccb6/users";

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // samler inn verdier fra input-feltene
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    // henter data fra CrudCrud API
    fetch(apiEndpoint)
      .then(function (response) {
        console.log("Login request status:", response.status);
        return response.json();
      })
      .then(function (users) {
        // sjekke om brukeren matcher input
        const isValidUser = users.some(function (user) {
          return (
            user.username === enteredUsername &&
            user.password === enteredPassword
          );
        });

        // resultat av om brukeren er gyldig
        if (isValidUser) {
          alert("Login successful!");
          window.location.href = "dashboard.html";
        } else {
          alert("Invalid username or password. Try again!");
        }
      })
      .catch(function (error) {
        console.error("Error checkin login:", error);
      });
  });
