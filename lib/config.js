var sys = require('sys');
var fs = require('fs');

var Store = require('./store').Store;
var WikiServer = require('./WikiServer').WikiServer;
var TemplateRenderer = require("./TemplateRenderer").TemplateRenderer;

var config = function(path, cb){
	this.path = path;
	
	var self = this;
	
	fs.readFile(this.path, function(err, data){
		self.config = JSON.parse(data.toString());

		self.setupStore();		
		self.setupServer();
		self.setupTemplateRenderer();
		
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

config.prototype.setupTemplateRenderer = function(){
	var renderer = new TemplateRenderer("./templates");
	this.templateRenderer = renderer;
	
	sys.puts("Got a renderer for server " + sys.inspect(this.server));
	this.server.templateRenderer = function(object, cb){
		return renderer.renderContents(object, cb);
	}
}

exports.config = config;