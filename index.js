const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const { UserModel, ExerciseModel } = require('./models/models.js');

mongoose.connect(process.env.MONGO_URI);
require('dotenv').config()
app.use(cors())
app.use(express.urlencoded());
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//
app.post('/api/users', async function(req, res) {
  try {
  if (!req.body.username) {
    throw new Error('Please provide a username')
  }
  const model = await UserModel.create({username: req.body.username})
  res.status(201).json(model)
  } catch (error) {
    console.log(error.message);
    res.status(400).json({error: error.message})
  }
})

app.get('/api/users', async function(req, res) {
  try {
   const users = await UserModel.find({})
    if (!users) throw new Error('No user exists');
    res.status(200).json(users);
  } catch(error) {
    console.log(error);
    res.status(400).json({error: error})
  }
})

app.post('/api/users/:id/exercises', async function(req, res) {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) throw new Error('No user found');
    const username = user.username;
    const exercise = {
      user_id: req.params.id,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString(),
    }
    const newExercise = await ExerciseModel.create(exercise);
    res.json({username: username,
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date,
              '_id': req.params.id});
  } catch(error) {
    console.log('error', error);
    res.status(400).json({error: error.message})
  }
  console.log(req.body);
})

app.get('/api/users/:id/logs', async function(req, res) {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const limit = Number(req.query.limit);
    console.log("from", req.query.from);
    console.log("to", req.query.to);
    console.log('limit', req.query.limit)
    const exercises = await ExerciseModel.find({user_id: req.params.id,});
    const user = await UserModel.findById(req.params.id);
    let log = []
    for (const exercise of exercises) {
      if (from && to) {
      const date = new Date(exercise.date);
        console.log('date', date)
        console.log(date > to)
        if (date < from || date > to) continue;
      }
      log.push({description: exercise.description,
                duration: exercise.duration,
                date: exercise.date})
    }
    if (limit) log = log.slice(0,limit);
    const response = {
      username: user.username,
      count: log.length,
      '_id': req.params.id,
      log: log
    }
    console.log(response)
    res.status(200).json(response);
  } catch (error) {
    console.log(error)
  }
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
