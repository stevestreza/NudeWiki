var mongodb = require("mongodb"),
        sys = require("sys");

var client = new mongodb.Db('foo', new mongodb.Server("127.0.0.1", 27017, {}) );

client.open(function(p_client) {
        client.createCollection('test_insert', function(err, collection) {
          client.collection('test_insert', function(err, collection) {
            for(var i = 1; i < 1000; i++) {
              collection.insert({c:1}, function(err, docs) {});
            }

            collection.insert({a:2}, function(err, docs) {
              collection.insert({a:3}, function(err, docs) {
                collection.count(function(err, count) {
		sys.puts("Count should be 1001 - " + count);
                  // Locate all the entries using find
                  collection.find(function(err, cursor) {
                    cursor.toArray(function(err, results) {
			sys.puts("Results.length should be 1001 - " + results.length);
			sys.puts("Results[0] shouldn't be null - " + (results[0] != null));

                      // Let's close the db
                      client.close();
                    });
                  });
                });
              });
            });
          });
        });
  });
