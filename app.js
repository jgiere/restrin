var fs = require('fs');

function analyzeDir(dirPath, pattern, debug) {
	//Suche nach allen Dateien im aktuellen Order, die "(2014" enthalten.
	var dir_files = fs.readdirSync(dirPath);

	dir_files.forEach(function(file) {

		var index = file.indexOf(pattern);

		if(index != -1) {

			var newPath, newName, endIndex;
			var oldPath = dirPath + '/' + file;
			console.log('File found: ' + oldPath);

			//Finde Endindex
			endIndex = file.indexOf(')', index);
			newName = file.substring(0, index) + file.substring(endIndex + 1);
			newPath = dirPath + '/' + newName;

			//If debug mode is enabled, do not rename the files.
			if(!debug) {
				fs.rename(dirPath + '/' + file, newPath, function(err) {
					if(err) {
						throw err;
					} else {
						console.log('File renamed to: ' + newPath);
					}
				});
			} else {
				console.log('File renamed to: ' + newPath);
			}
		}
	});


	readDir(dirPath);
}

function readDir(path, pattern, debug) {
	fs.readdir(path, function(err, files) {
		if(err) {
			throw err;
		}

		files.forEach(function(file) {
			var dirPath = path + "/" + file;

			fs.stat(dirPath, function(err, stats) {
				if(err || stats === undefined) {
					return;
				}

				if(stats.isDirectory()) {
					analyzeDir(dirPath, pattern, debug);
				}
			});
		});
	});
}

var args = process.argv;

if(args.length < 4 || args.length > 5) {
	console.log("Please provide the root directory and the search pattern.");
	console.log("Abort");
	process.exit(1);
}

var folder = args[2];
var pattern = args[3];

var debug = false;
if(args.length == 5) {
	debug = args[4];
}

//Go for the files in the root directory
analyzeDir(folder, pattern, debug);

readDir(folder, pattern, debug);
