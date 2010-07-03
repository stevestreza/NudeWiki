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
	var server = this.config.server;
	var self = this;

	server.readHandler = function(pageName, cb){
		self.getContentsOfPage(pageName, cb);
	}
	
	server.writeHandler = function(pageName, body, cb){
		self.setContentsOfPage(pageName, body, cb);
	}
	
	server.deleteHandler = function(pageName, cb){
		self.deletePage(pageName, cb);
	}
}

NudeWiki.prototype.getContentsOfPage = function(pageName, cb){
	this.config.store.valueForKey(pageName, function(data){
		if(data == undefined){
			cb("No page found named " + pageName);
		}else{
			cb(data);
		}
	});
}

NudeWiki.prototype.setContentsOfPage = function(pageName, body, cb){
	this.config.store.setKeyToValue(pageName,body, function(){
		cb("Page " + pageName + " updated.<br/><br/>" + body);
	});	
}

NudeWiki.prototype.deletePage = function(pageName, cb){
	this.config.store.deleteValueForKey(pageName, function(){
		cb("Page " + pageName + " deleted.");
	});
}

exports.NudeWiki = NudeWiki;