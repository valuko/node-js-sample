//require imprtant modules

var express = require('express');
var mysqlConn = require('mysql');
var sha256 = require('sha256');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());

app.use(bodyParser.json()); // for parsing application/json

var connection = mysqlConn.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'btex_currency',
  port: 3307,
});

app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!,We are getting started with NodeJS');
});

app.post('/api/register', function(request, response) {
  console.log('Request Body: ', request.body);
  var reqBody = request.body;
  connection.connect(function(err) {
    if (err) throw err;

    var sql =
      "INSERT INTO users (first_name, last_name, email_address, currency, password) VALUES ('" +
      reqBody.first_name +
      "','" +
      reqBody.last_name +
      "','" +
      reqBody.email+
      "','" +
      reqBody.currency.code +
      "','" +
      sha256(reqBody.password) +
      "')";
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log('Result: ', result.insertId);
      response.json({token: result.insertId, response: 'success'});
    });
  });
});

app.post('/api/login', function(request, response) {
  console.log('Request Body: ', request.body);
  var reqBody = request.body;
  connection.connect(function(err) {
    if (err) throw err;
    var sql =
      "SELECT * FROM users WHERE email_address = '" +
      reqBody.email +
      "' AND password = '" +
      sha256(reqBody.password) +
      "' LIMIT 1";
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log('Result is :', result);

      if (typeof result[0] == 'undefined') {
        response.json({
          status: true,
          message: 'Authentication Denied',
        });
        return;
      }

      response.json({
        token: result[0].id,
        response: 'successfully authenticated',
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
