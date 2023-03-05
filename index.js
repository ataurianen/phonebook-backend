/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const Person = require('./models/person');

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

morgan.token('data', (request) => {
  const { body } = request;
  return `{"name":"${body.name}", "number":"${body.number}"}`;
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-lenght] :response-time ms :data'),
);
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/info', (request, response) => {
  Person.countDocuments().then((countDocuments) => {
    response.send(
      `<p>Phonebook has info for ${countDocuments} people</p><br>${new Date()}`,
    );
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(() => {
    response.json(person);
  })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
