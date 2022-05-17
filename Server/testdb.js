var mysql = require('mysql');
var http = require('http');
var url = require('url');

/* Creating connection with mysql database */
var con = mysql.createConnection({
  host: "localhost",
  port: "3307",
  user: "root",
  password: "India@123"
});

// Create database if does not exist
con.query("CREATE DATABASE IF NOT EXISTS mydb", (err,res)=>{});

// Use database mydb as default
con.query("USE mydb", (err,res)=>{});

// Create table if does not exist
con.query("CREATE TABLE IF NOT EXISTS persons (name VARCHAR(255), occupation VARCHAR(255))", function(err,result){
  if (err) throw err;
  console.log(result);
});

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var query = q.path.replace('/', '');

  //  Read the data from Mysql database
  if (query == 'data') {
    con.query("SELECT * FROM persons", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      data = JSON.stringify(result);
      return res.end(data);
    });
  }
  //  Write the data to Mysql database
  else if (query == 'writedata') {
    req.on('data', chunk => {
      let params = JSON.parse(chunk);
      var sql = `INSERT INTO persons (name, occupation) VALUES ('${params[0].name}', '${params[0].occupation}')`;
      con.query(sql, function (err, result) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          return res.end('[{"message":"Unable to update"}]');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          return res.end('[{"message":"updated"}]');
        }
      });
    });
  }
  // Delete the data from Mysql database
  else if (query == 'deletedata') {
    req.on('data', chunk => {
      let params = JSON.parse(chunk);
      var sql = `DELETE FROM persons WHERE name = '${params[0].name}'`;
      con.query(sql, function (err, result) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          return res.end('[{"message":"Unable to delete"}]');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          return res.end('[{"message":"Deleted"}]');
        }
      });
    });
  }
  // Not Found Condition if URL is something else
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    return res.end('[{"message":"Not Found"}]');
  }

}).listen(8080);