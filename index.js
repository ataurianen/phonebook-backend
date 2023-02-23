const { response, request } = require("express");
const express = require("express");
const app = express();

const PORT = 3001;

app.use(express.json());

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/info", (request, response) => {
  const numOfPeople = phonebook.length;
  const currentTime = new Date();

  response.send(
    `<p>Phonebook has info for ${numOfPeople} people</p><br>${currentTime}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const randomID = Math.floor(Math.random() * (10000 - 1) + 1);

  const person = request.body;
  person.id = randomID;
  phonebook = phonebook.concat(person);

  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
