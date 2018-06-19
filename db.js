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

function remove(barcode, callback) {
    var prop = {"barcode" : barcode};    
    global.conn.collection("prod").deleteOne(prop, callback);
}

module.exports = { findAll, insert, remove }