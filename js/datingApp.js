const apiUrl =
  "https://crudcrud.com/api/59bd4a25395f4afca8a59d97f014ccb6/users";

const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user || !user._id) {
  window.location.href = "login.html";
}

const profileUsername = document.getElementById("profileUsername");
const editUsername = document.getElementById("editUserName");
const saveBtn = document.getElementById("saveChangesBtn");
const userList = document.getElementById("randomUsersContainer");

profileUsername.textContent = user.username;
editUsername.value = user.username;

saveBtn.addEventListener("click", () => {
  const newUsername = editUsername.value.trim();
  if (!newUsername) return alert("Brukernavn kreves.");

  fetch(`${apiUrl}/${user._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newUsername, password: user.password }),
  })
    .then((res) => {
      console.log("PUT status:", res.status);
      if (!res.ok) throw new Error();
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...user, username: newUsername })
      );
      profileUsername.textContent = newUsername;
      alert("Oppdatert!");
    })
    .catch(() => alert("Feil ved oppdatering."));
});

// tre tilfeldige brukere fra randomuser.me API
fetch("https://randomuser.me/api/?results=3")
  .then((res) => {
    console.log("Random user API status:", res.status);
    return res.json();
  })
  .then((data) => {
    data.results.forEach((u) => {
      userList.innerHTML += `
        <div class="match">
        <img src="${u.picture.medium}" alt="Profilbilde"/>
        <p>${u.name.first} ${u.name.last}</p>
        </div>`;
    });
  })
  .catch((err) => {
    console.log("Error fetching random users:", err);
  });
