require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

const generateID = () => {
  const max = 10000;
  const min = 1;
  return (randomID = Math.floor(Math.random() * (max - min) + min));
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("data", (request) => {
  const body = request.body;
  return `{"name":"${body.name}", "number":"${body.number}"}`;
});

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-lenght] :response-time ms :data")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/info", (request, response) => {
  const numOfPeople = Person.length;
  const currentTime = new Date();

  response.send(
    `<p>Phonebook has info for ${numOfPeople} people</p><br>${currentTime}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
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

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
