var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost/valCheck")
            .then(conn => global.conn = conn.db("valCheck"))
            .catch(err => console.log(err))

function findAll(callback){  
    global.conn.collection("prod").find({}).toArray(callback);
}

function insert(customer, callback){
    global.conn.collection("prod").insert(customer, callback);
}

module.exports = { findAll, insert }