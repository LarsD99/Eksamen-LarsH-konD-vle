const apiUrl =
  "https://crudcrud.com/api/0f32d409b6b94850a59a7b2d4bd83f17/users";

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

// Tillegsfunksjon: av superlike ny knapp legges til
const superlikeBtn = document.getElementById("superlikeBtn");

// likte brukere
const likedUsersContainer = document.getElementById("likedUsersContainer");

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

// last inn likte brukere
function loadLikedUsers() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((users) => {
      const liked = users.filter(
        (u) => u.likedBy && u.likedBy === user.username
      );
      likedUsersContainer.innerHTML = "";

      if (!liked.length) {
        likedUsersContainer.innerHTML = "<p>No liked users.</p>";
        return;
      }

      liked.forEach((u) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${u.picture.medium || ""}" alt="Profilbilde"/>
            <p>${u.name.first || ""} ${u.name.last || ""}, ${
          u.dob.age || ""
        } yrs</p>
            <button>Delete</button>
            `;

        div.querySelector("button").addEventListener("click", () => {
          deleteLikedUser(u._id);
        });

        likedUsersContainer.appendChild(div);
      });
    })
    .catch((err) => console.log("Error loading liked users:", err));
}

// Tillegsfunksjon: last inn superlike
function loadSuperlikedUsers() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((users) => {
      const container = document.getElementById("superlikedUsersContainer");
      const superliked = users.filter(
        (u) => u.superlikedBy && u.superlikedBy === user.username
      );

      container.innerHTML = "";

      if (!superliked.length) {
        container.innerHTML = "<p>No superliked users.</p>";
        return;
      }

      superliked.forEach((u) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <img src="${u.picture.medium || ""}" alt="Profilbilde"/>
          <p>${u.name.first || ""} ${u.name.last || ""}, ${
          u.dob.age || ""
        } yrs</p>
          <button>Delete</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
          deleteSuperlikedUser(u._id);
        });

        container.appendChild(div);
      });
    })
    .catch((err) => console.log("Error loading superliked users:", err));
}

// slett brukere som er likt
function deleteLikedUser(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => loadLikedUsers())
    .catch((err) => console.log("Error deleting liked user:", err));
}

// Tillegsfunksjon: slett superlike
function deleteSuperlikedUser(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => loadSuperlikedUsers())
    .catch((err) => console.log("Error deleting superliked user:", err));
}

// Like og skip
likeBtn.addEventListener("click", () => {
  const likedUser = filteredUsers[currentUser];
  if (likedUser) {
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likedBy: user.username,
        name: likedUser.name,
        dob: likedUser.dob,
        location: likedUser.location,
        picture: likedUser.picture,
      }),
    })
      .then(() => {
        currentUser++;
        loadLikedUsers();
        loadSuperlikedUsers(); //oppdatering med superlike

        localStorage.setItem(
          "matchState",
          JSON.stringify({ users: filteredUsers, index: currentUser })
        );
        showSingleUser();
      })
      .catch((err) => {
        console.log("Error liking user:", err);
      });
  }
});

skipBtn.addEventListener("click", () => {
  currentUser++;

  localStorage.setItem(
    "matchState",
    JSON.stringify({ users: filteredUsers, index: currentUser })
  );
  showSingleUser();
});

// tillegsfunksjonalitet superlike
superlikeBtn.addEventListener("click", () => {
  const u = filteredUsers[currentUser];
  if (!u) return;

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      superlikedBy: user.username,
      name: u.name,
      dob: u.dob,
      location: u.location,
      picture: u.picture,
      superliked: true,
    }),
  })
    .then(() => {
      currentUser++;
      loadLikedUsers();
      localStorage.setItem(
        "matchState",
        JSON.stringify({
          users: filteredUsers,
          index: currentUser,
        })
      );
      showSingleUser();
    })
    .catch((err) => console.log("Error superliking user:", err));
});

applyFilterBtn.addEventListener("click", () => {
  localStorage.setItem("filterGender", genderFilter.value);
  localStorage.setItem("filterAge", ageInput.value);
  showFilteredUsers();
  loadFilteredMatches();
});

const saved = JSON.parse(localStorage.getItem("matchState"));
if (saved?.users && saved.index !== undefined) {
  filteredUsers = saved.users;
  currentUser = saved.index;
  showSingleUser();
} else {
  loadFilteredMatches();
}

showFilteredUsers();
loadLikedUsers();

// Tillegsfunksjon: superlike
loadSuperlikedUsers();
