var sys = require("sys");
var store = require("./store");
var config = require("./config").config;

var NudeWiki = function(configPath){
	var self = this;

	this.configPath = configPath;	
	
	this.config = new config(this.configPath,function(){
		self.setup();
	});
}

NudeWiki.prototype.setup = function(){
	var key = "foo"
	var value = "bar";

	var myFileStore = this.config.store;

	myFileStore.setKeyToValue(key, value, function(){
		sys.log("Setting key " + key + " to value " + value);
		myFileStore.valueForKey(key, function(data){
			sys.log("Value for key " + key + ": " + data + " (equal? " + (data == value) + ")");

			myFileStore.deleteValueForKey(key, function(){
				sys.log("Value for key " + key + " should be deleted now");
			})
		})
	});	
}

exports.NudeWiki = NudeWiki;