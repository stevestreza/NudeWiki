var sys = require('sys');
var fs = require('fs');
var Buffer = require("buffer").Buffer;
var Store = require('./Store').Store;

var FileStore = function(path){
	this.path = path;
}

FileStore.prototype.keys = function(cb){
	var keys = [];
	fs.readdir(this.path, function(err, files){
		for(var filename in files){
			keys.push(filename);
		}

		if(cb) cb(keys);
	});
}

FileStore.prototype.valueForKey = function(key,cb){
	var path = this._getPathForKey(key);
	if(!path){
		if(cb) cb(null);
		return;
	}
	
	fs.readFile(path, function(err, data){
		if(err){
			//sys.log("Oh noes, couldn't read, err " + err);
		}else{
			//sys.log("got data from path " + path + ": " + data);
		}
		if(cb) cb(data);
	});
}

FileStore.prototype.setKeyToValue = function(key, value, cb){
	var path = this._getPathForKey(key);
	if(!path){
		if(cb) cb();
		return;
	}

	fs.writeFile(path, value, function(err){
		if(err){
			//sys.log("Oh noes, couldn't write, err " + err);
		}else{
			//sys.log("wrote " + value + " to path " + path);
		}

		if(cb) cb();
	});
}

FileStore.prototype.deleteValueForKey = function(key, cb){
	var path = this._getPathForKey(key);
	if(!path){
		if(cb) cb();
		return;
	}

	fs.unlink(path);
	
	if(cb) cb();
}

FileStore.prototype._getPathForKey = function(key){
	if(!key) return null;
	
	var path = this.path + "/" + key; // TODO fix this for Windows?
	if(path.indexOf(this.path) == -1){
		return null;
	}else{
		//sys.log("For key " + key + ", we have path " + path);
		return path;
	}
}

// config loading
FileStore.configKey = "file";

FileStore.loadFromConfig = function(config){
	var path = config.path;
	if(!path) return null;
	
	return new FileStore(path);
}

exports.FileStore = FileStore;