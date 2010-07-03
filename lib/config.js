var sys = require('sys');
var fs = require('fs');

var Store = require('./store').Store;
var WikiServer = require('./WikiServer').WikiServer;

var config = function(path, cb){
	this.path = path;
	
	var self = this;
	
	fs.readFile(this.path, function(err, data){
		self.config = JSON.parse(data.toString());

		self.setupStore();		
		self.setupServer();
		
		cb(this);
	});
}

config.prototype.setupStore = function(){
	var storeType  = this.config.store.type;
	var storeClass = Store.storeForType(storeType);
	var store = storeClass.loadFromConfig(this.config.store);
	
	this.store = store;
}

config.prototype.setupServer = function(){
	var serverPort = this.config.port;
	this.serverPort = serverPort;
	this.server = new WikiServer(this.serverPort);
}

exports.config = config;