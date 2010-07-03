var sys = require('sys');
var http = require('http');

var WikiServer = function(port){
	if(!port) port = 8080;
	this.port = port;
	
	this.readHandler = function(){};
	this.writeHandler = function(){};
	this.deleteHandler = function(){};
	
	this.templateRenderer = function(body, data, cb){cb(body);}
	
	var self = this;
	this.server = new http.createServer(function(request, response){
		self.handleRequest(request,response);
	});
	
	this.server.listen(this.port);
}

WikiServer.prototype.handleRequest = function(request,response){
	var self = this;
	
	if(!self.isRequestAuthenticated(request)){
		self.writeErrorCodeAndMessageToResponse(403, "You are not authorized to view this page.", response);
		return;
	}
	
	var url = request.url;
	var pathName = this.pathNameForURL(url);
	
  	var cb = function(responseBody){
		self.writePageBodyForPathToResponse(responseBody, pathName, response);
	}
	
	if(request.method == "GET"){
		self.readHandler(pathName, cb);
	}else if(request.method == "POST"){
		if(request.url.substr(request.url.length - 6, 6) == "delete"){
			self.deleteHandler(pathName, cb);
		}else{
			var dataChunks = [];
			request.addListener('data', function(chunk){
				dataChunks.push(chunk);
			})
			request.addListener('end', function(){
				self.writeHandler(pathName, dataChunks.join(''), cb);
			})
		}
	}
}

WikiServer.prototype.isRequestAuthenticated = function(request){
	if(request.url == "/secure") return false;
	return true;
}

WikiServer.prototype.writePageBodyForPathToResponse = function(responseBody, path, response){
	var dict = {
		page: responseBody,
		title: path
	}
	
	sys.puts("lets render");

	this.templateRenderer(dict, function(body){
		response.writeHead(200, {
			'Content-Type': "text/html",
			'Content-Length': body.length
		});

		response.write(body);
		response.end();
	});
}

WikiServer.prototype.writeErrorCodeAndMessageForPathToResponse = function(errorCode, message, path, response){
	var dict = {
		page: message,
		title: path
	}

	this.templateRenderer(dict, function(body){
		response.writeHead(200, {
			'Content-Type': "text/html",
			'Content-Length': body.length
		});

		response.write(body);
		response.end();
	});
}

WikiServer.prototype.pathNameForURL = function(url){
	if(url.substr(url.length-1, 1) == "/"){
		url = url + "index";
	}
	
	return url.substr(1, url.length-1);
}

exports.WikiServer = WikiServer;