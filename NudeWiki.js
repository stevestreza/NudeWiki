var sys = require("sys");
var store = require("./store");

var myFileStore = new store.FileStore("/Users/syco/Desktop/test");

var key = "foo"
var value = "bar";

myFileStore.setKeyToValue(key, value, function(){
	sys.log("Setting key " + key + " to value " + value);
	myFileStore.valueForKey(key, function(data){
		sys.log("Value for key " + key + ": " + data + " (equal? " + (data == value) + ")");
		
		myFileStore.deleteValueForKey(key, function(){
			sys.log("Value for key " + key + " should be deleted now");
		})
	})
});