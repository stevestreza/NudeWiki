var NudeWiki = require('./lib/NudeWiki').NudeWiki;
var sys = require('sys');

function main(configPathArgOrHelp){
	var configPath = "./config.json";

	if(configPathArgOrHelp == "--help" || configPathArgOrHelp == "-h"){
		sys.puts("Usage: node NudeWiki.js [-h|--help] [configPath]");
		return;
	}else if(configPathArgOrHelp){
		configPath = configPathArgOrHelp;
	}
	var wiki = new NudeWiki(configPath);
}

main.apply(this, process.argv.splice(2));