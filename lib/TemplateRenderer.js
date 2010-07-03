var sys = require('sys');
var fs = require('fs');
var mustache = require('./contrib/mustache').Mustache;

sys.puts("Loading up mustache " + sys.inspect(mustache))

var TemplateRenderer = function(path){
	this.path = path;
	
	this.templateNames = [];

	var self = this;
	fs.readdir(this.path, function(err, names){
		names.forEach(function(name){
			sys.puts("We found " + name);
			if(name.substr(name.length-3, 3) == ".mu"){
				self.templateNames.push(name.substr(0, name.length-3));
			}
		});
	});
}

TemplateRenderer.prototype.allTemplateNames = function(){
	return this.templateNames;
}

TemplateRenderer.prototype.loadCurrentTemplate = function(cb){
	var templateName = null;
	
	if(this.selectedTemplateName){
		templateName = this.selectedTemplateName;
		sys.puts("We got template name " + templateName);
	}else{
		templateName = this.allTemplateNames()[0];
	}
	
	fs.readFile(this.path + "/" + templateName + ".mu", function(err,data){
		if(err){
			sys.puts("Couldn't load template: " + sys.inspect(err));
		}else{
			cb(data);
		}
	});
}

TemplateRenderer.prototype.renderContents = function(data, cb){
	sys.puts("Rendering");
	this.loadCurrentTemplate(function(template){
		sys.puts("Rendering template " + template);
		
		var html = mustache.to_html(template.toString(), data);
		cb(html);
	});
}

exports.TemplateRenderer = TemplateRenderer;