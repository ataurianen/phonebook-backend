const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = 3001;

const generateID = () => {
  const max = 10000;
  const min = 1;
  return (randomID = Math.floor(Math.random() * (max - min) + min));
};

app.use(express.json());
app.use(morgan("tiny"));

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
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "missing name",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "missing number",
    });
  }

  if (phonebook.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name is already in phonebook",
    });
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);

  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
