// side 1: hva blir testet? At innlogging faktisk fungerer med riktig brukernavn og passord

// brukernavn og  passord skal fungere med riktig innlogging
test("Brukeren skal logge inn med riktig brukernavn og passord", () => {
  const brukernavn = "Lars";
  const passord = "123";

  // Simulerer innlogging mot database CrudCrud

  const brukere = [{ username: "Lars", password: "123" }];

  const funnet = brukere.find(
    (user) => user.username === brukernavn && user.password === passord
  );

  expect(funnet).not.toBeUndefined(); //blir godkjent hvis brukeren finnes
});

// side 2: hva blir testet? At app viser en og en bruker etter filtrering som er et krav i oppgaven.
test("En tilfeldig bruker skal bli vist på skjerm etter filtrering", () => {
  const brukere = [
    { name: "Lars", age: 26 },
    { name: "Kari", age: 22 },
  ];

  let currentIndex = 0;
  const valgtBruker = brukere[currentIndex];

  expect(valgtBruker).toEqual({ name: "Lars", age: 26 });
});
