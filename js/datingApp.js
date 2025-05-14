const apiUrl =
  "https://crudcrud.com/api/05c12c20edc54cff8a3e0db806e7a9f6/users";

const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user || !user._id) {
  window.location.href = "login.html";
}

// Brukerprofil (profilvisning og redigering)
const profileUsername = document.getElementById("profileUsername");
const editUsername = document.getElementById("editUserName");
const saveBtn = document.getElementById("saveChangesBtn");

// Filtrering av brukere
const genderFilter = document.getElementById("genderFilter");
const ageInput = document.getElementById("ageInput");
const applyFilterBtn = document.getElementById("applyFilterBtn");

// Matchforslag og en-om gangen visning
const userList = document.getElementById("randomUsersContainer");
const matchContainer = document.getElementById("singleUserContainer");
const likeBtn = document.getElementById("likeBtn");
const skipBtn = document.getElementById("skipBtn");

// fyll inn eksisterende data
profileUsername.textContent = user.username;
editUsername.value = user.username;
genderFilter.value = localStorage.getItem("filterGender") || "";
ageInput.value = localStorage.getItem("filterAge") || "";

// oppdatert brukernavn
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

// filtrering av brukere
function showFilteredUsers() {
  userList.innerHTML = "";

  fetch("https://randomuser.me/api/?results=50")
    .then((res) => {
      console.log("Random user API status:", res.status);
      return res.json();
    })
    .then(({ results }) => {
      const gender = genderFilter.value;
      const age = parseInt(ageInput.value);

      const matches = results
        .filter(
          (u) => (!gender || u.gender === gender) && (!age || u.dob.age === age)
        )
        .slice(0, 3);

      userList.innerHTML = matches.length
        ? matches
            .map(
              (u) => `
            <div class="match">
            <img src="${u.picture.medium}" alt="Profilbilde"/>
            <p>${u.name.first} ${u.name.last}, ${u.dob.age} yrs</p>
            </div>`
            )
            .join("")
        : "<p>No matches found.</p>";
    })
    .catch((err) => {
      console.log("Error fetching random users:", err);
    });
}

let filteredUsers = [];
currentUser = 0;

function loadFilteredMatches() {
  fetch("https://randomuser.me/api/?results=30")
    .then((res) => {
      console.log("Random user API status:", res.status);
      return res.json();
    })
    .then(({ results }) => {
      const gender = genderFilter.value;
      const age = parseInt(ageInput.value);

      filteredUsers = results.filter(
        (u) => (!gender || u.gender === gender) && (!age || u.dob.age === age)
      );

      currentUser = 0;
      showSingleUser();
    })
    .catch((err) => console.log("Error fetching filtered matches:", err));
}

function showSingleUser() {
  const u = filteredUsers[currentUser];
  if (!u) {
    matchContainer.innerHTML = "<p>No more matches.</p>";
    return;
  }

  matchContainer.innerHTML = `
    <img src="${u.picture.medium}" alt="Profilbilde"/>
    <p>${u.name.first} ${u.name.last}, ${u.dob.age} yrs</p>
    <p>${u.location.city}, ${u.location.country}</p>
    `;
}

// Like og skip
likeBtn.addEventListener("click", () => {
  const likedUser = filteredUsers[currentUser];
  if (likedUser) {
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...likedUser, likedBy: user.username }),
    });
  }
  currentUser++;
  showSingleUser();
});

skipBtn.addEventListener("click", () => {
  currentUser++;
  showSingleUser();
});

applyFilterBtn.addEventListener("click", () => {
  localStorage.setItem("filterGender", genderFilter.value);
  localStorage.setItem("filterAge", ageInput.value);
  showFilteredUsers();
  loadFilteredMatches();
});

showFilteredUsers();
