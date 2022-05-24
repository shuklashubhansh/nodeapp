var http = require('http');
var url = require('url');
var mongo = require('mongodb');
var mongodbclient = mongo.MongoClient;
var mongourl = "mongodb+srv://root:<password>@cluster0.oomvg.mongodb.net/?retryWrites=true&w=majority"; //Tip: Replace <password>

mongodbclient.connect(mongourl, function (err, db) {
    if (err) throw err;
    var con = db.db("mydb");
    console.log('connected to database successfully.');

    http.createServer(function (req, res) {
        var q = url.parse(req.url, true);
        var query = q.path.replace('/', '');

        //  Read the data from Mongodb
        if (query == 'data') {
            con.collection("persons").find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                data = JSON.stringify(result);
                return res.end(data);
                db.close();
            });
        }
        //  Write the data to Mongodb
        else if (query == 'writedata') {
            req.on('data', chunk => {
                let params = JSON.parse(chunk);
                con.collection("persons").insertOne(params[0], function (err, result) {
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
        // Delete the data from Mongodb
        else if (query == 'deletedata') {
            req.on('data', chunk => {
                let params = JSON.parse(chunk);
                let query = { name: params[0].name };
                con.collection("persons").deleteOne(query, function (err, obj) {
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
});