var sys = require('sys');
var http = require('http');

var WikiServer = function(port){
	if(!port) port = 8080;
	this.port = port;
	
	this.readHandler = function(){};
	this.writeHandler = function(){};
	this.deleteHandler = function(){};
	
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
		self.writePageBodyToResponse(responseBody, response);
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

WikiServer.prototype.writePageBodyToResponse = function(responseBody, response){
	var body = "<html><body>" + responseBody + "</body></html>";
	response.writeHead(200, {
		'Content-Type': "text/html",
		'Content-Length': body.length
	});
	
	response.write(body);
	response.end();
}

WikiServer.prototype.writeErrorCodeAndMessageToResponse = function(errorCode, message, response){
	var body = "<html><body>" + message + "</body></html>";
	response.writeHead(errorCode, {
		'Content-Type': "text/html",
		'Content-Length': body.length
	});
	
	response.write(body);
	response.end();
}

WikiServer.prototype.pathNameForURL = function(url){
	if(url.substr(url.length-1, 1) == "/"){
		url = url + "index";
	}
	
	return url.substr(1, url.length-1);
}

exports.WikiServer = WikiServer;