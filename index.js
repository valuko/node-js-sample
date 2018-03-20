//require imprtant modules

var express = require('express');
var mysql = require('mysql');
var sha256 = require('sha256');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());

app.use(bodyParser.json()); // for parsing application/json

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.json({status: "ok!"});
});

app.post('/api/register', function(request, response) {
  console.log('Request Body: ', request.body);
  var reqBody = request.body;
  var sql =
  "SELECT COUNT(*) AS count from  users WHERE email_address='" + reqBody.email +"'";
  connection.query(sql,function(error,results){
if (error){
  throw error;
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
  reqBody.currency+
  "','" +
  sha256(reqBody.password) +
  "')";
connection.query(sql, function(err, result) {
  if (err) throw err;
  console.log('Result: ', result.insertId);
  response.json({token: result.insertId, response: 'success'});
});
 } 




    

app.post('/api/login', function (request, response) {
    console.log('Request Body: ', request.body);
    var reqBody = request.body;

    var sql =
        "SELECT * FROM users WHERE email_address = '" +
        reqBody.email +
        "' AND password = '" +
        sha256(reqBody.password) +
        "' LIMIT 1";

    connection.query(sql, function (err, result) {
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

app.listen(app.get('port'), function () {
    console.log('Node app is running at localhost:' + app.get('port'));
});

function isExistingUser(email){
var sql="SELECT email_address FROM users WHERE email_address ='" + email+ "'";
connection.query(sql,function(error,result){
  if (error) throw error;
  if (typeof result[0]=='undefinded'){
    return false;
  }
  return true;

});
}

