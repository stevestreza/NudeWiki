var sys = require('sys');

var Store = function(){
	this.data = {};
}

Store.prototype.keys = function(cb){
	var keys = [];
	for(var key in this.data){
		keys.push(key);
	}
	if(cb) cb(keys);
}

Store.prototype.valueForKey = function(key, cb){
	if(cb) cb(this.data[key]);
}

Store.prototype.setKeyToValue = function(key, value, cb){
	this.data[key] = value;
	if(cb) cb();
}

Store.prototype.deleteValueForKey = function(key, cb){
	this.data[key] = undefined;
	if(cb) cb();
}

// config loading
Store.configKey = "memory";
Store.loadFromConfig = function(config){
	return new Store();
}

// all stores
Store.registerStore = function(store){
	if(!Store._allStores){
		Store._allStores = {};
	}
	
	var configKey = store.configKey;
	Store._allStores[configKey] = store;
}

Store.storeForType = function(storeType){
	var store = null;
	if(Store._allStores){
		store = Store._allStores[storeType];
	}
	return store;
}

Store.registerStore(Store);

exports.Store = Store;