var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
  var q = url.parse(req.url,true);
  var query = q.path.replace('/','');

  // Read the data from the JSON file
  if(query == 'data'){
    fs.readFile('../Filesystem/data.json',function(err, data){
      res.writeHead(200, {'Content-Type': 'application/json'});
      data = '['+data+']';
      return res.end(data);
    });
  } 
  
  // Write the data into JSON file
  else if(query == 'writedata') {
    req.on('data', chunk => {
      chunk = JSON.stringify(JSON.parse(chunk)).replace('[','').replace(']','').toString();
      fs.appendFile('../Filesystem/data.json', ','+chunk, function (err) {
        if (err){
          res.writeHead(500,{'Content-Type':'application/json'})
          return res.end('[{"message":"Unable to update"}]');
        } else {
          res.writeHead(200,{'Content-Type':'application/json'})
          return res.end('[{"message":"updated"}]');
        }  
      });
    });
  } 

  // Clear and Write the data into JSON file
  else if(query == 'deletedata') {
    req.on('data', chunk => {
      chunk = JSON.stringify(JSON.parse(chunk)).replace('[','').replace(']','').toString();
      fs.writeFile('../Filesystem/data.json', chunk, function (err) {
        if (err){
          res.writeHead(500,{'Content-Type':'application/json'})
          return res.end('[{"message":"Unable to delete"}]');
        } else {
          res.writeHead(200,{'Content-Type':'application/json'})
          return res.end('[{"message":"Deleted"}]');
        }  
      });
    });
  } 
  
  //Not Found Condition if URL is something else
  else {
    res.writeHead(404,{'Content-Type':'application/json'})
    return res.end('[{"message":"Not Found"}]');
  }

}).listen(8080);
