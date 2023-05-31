// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/:time?', function(req,res) {
  try {
    
  let time = req.params.time;
    
  if (time == Number(time)) {
    time = Number(time);
  } else if (!time) {
    time = new Date().getTime();
  }
    
  const date = new Date(time);
  const invalidMessage = 'Invalid Date'
  const obj = {
    unix: date.getTime(),
    utc: date.toUTCString(),
  }
    
  if (Object.values(obj).includes(invalidMessage)) {
    throw new Error(invalidMessage)
  }
    
  res.json(obj);
    
  } catch (err) {
    return res.status(400).json({error: err.message})
  }
  
})

app.get('/api/whoami', function(req, res) {
  try {
  const obj = {
    ipaddress: req.headers['x-forwarded-for'],
    language: req.headers['accept-language'],
    software: req.headers['user-agent'],
  }
  return res.status(200).json(obj);
  } catch (error) {
    return res.json({error: error.message})
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
