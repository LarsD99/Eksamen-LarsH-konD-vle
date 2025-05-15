const apiUrl =
  "https://crudcrud.com/api/9007425c8dbb44f196b93bcacb917c04/users";

// funsjon registrere bruker
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // verdier fra form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // sende data til CrudCrud API og lagre i database
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(function (response) {
        console.log("Registration code:", response.status);
        if (response.ok) {
          alert("User registered successfully!");
        } else {
          alert("Error registering user.");
        }
      })
      .catch(function (error) {
        console.log("Error registering user:", error);
      });
  });
