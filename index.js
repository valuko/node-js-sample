var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.post('/api/register', function (request, response) {
  response.json({ token: "123456", response: "success" });
})

app.get('/register', function (request, response) {
  response.json({ response: "success" });
})

app.post('/api/login', function (request, response) {
  response.json({ token: "123456", response: "success" });
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
