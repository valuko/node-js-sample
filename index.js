//require imprtant modules

var express = require('express');
var mysqlConn = require('mysql');
var sha256 = require('sha256');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());

app.use(bodyParser.json()); // for parsing application/json

var connection = mysqlConn.createConnection(process.env.CLEARDB_DATABASE_URL);

app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!,Welcom to John\'s Server');
});

app.post('/api/register', function(request, response) {
  console.log('Request Body: ', request.body);
  var reqBody = request.body;

  //check if user already exits
  var sql =
  "SELECT COUNT(*) AS count from  users WHERE email_address='" + reqBody.email +"'";
  connection.query(sql,function(error,results){
if (error){
  throw error
}
if (results[0].count >0){
  response.json({
    message:"User with Email already exits"
  });
return;
} else{
  createNewUser(reqBody,response);
}
});


function createNewUser(reqBody,response){
var sql =
"INSERT INTO users (first_name,last_name,email_address,currency,password";
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
 } 
});



    

app.post('/api/login', function(request, response) {
  console.log('Request Body: ', request.body);
  var reqBody = request.body;

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

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));

});
