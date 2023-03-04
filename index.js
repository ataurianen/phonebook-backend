require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "TypeError") {
    return response.status(400).send({ error: "Does not exist in database" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("data", (request) => {
  const body = request.body;
  return `{"name":"${body.name}", "number":"${body.number}"}`;
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-lenght] :response-time ms :data")
);
app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/info", (request, response) => {
  const currentTime = new Date();
  Person.countDocuments().then((count_documents) => {
    response.send(
      `<p>Phonebook has info for ${count_documents} people</p><br>${currentTime}`
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({
      error: "missing name",
    });
  }

  if (body.number === undefined) {
    return response.status(400).json({
      error: "missing number",
    });
  }

  /*
  if (phonebook.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name is already in phonebook",
    });
  }
  */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
