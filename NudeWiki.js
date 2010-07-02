var mongodb = require("mongodb"),
        sys = require("sys");

var client = new mongodb.Db('foo', new mongodb.Server("127.0.0.1", 27017, {}) );

client.open(function(p_client) {
 });
