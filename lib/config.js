var sys = require('sys');
var fs = require('fs');
var Store = require('./store').Store;

var config = function(path, cb){
	this.path = path;
	
	var self = this;
	
	fs.readFile(this.path, function(err, data){
		self.config = JSON.parse(data);
		self.setupStore();
		cb(this);
	});
}

config.prototype.setupStore = function(){
	var storeType  = this.config.store.type;
	var storeClass = Store.storeForType(storeType);
	var store = storeClass.loadFromConfig(this.config.store);
	
	this.store = store;
}

exports.config = config;