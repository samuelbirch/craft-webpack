const fs = require('fs');
const path = require('path');

function Indexer(options){
	
}

Indexer.prototype.apply = function(compiler){
	
	compiler.plugin('compilation', function(compilation) {
		
		compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback){
		//compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback){
			
			var root = './html/layouts';
			
			var walk = function(dir) {
			    var results = []
			    var list = fs.readdirSync(dir)
			    list.forEach(function(file) {
				    if(!file.startsWith('_') || !file.startsWith('.')){
				        file = dir + '/' + file
				        var stat = fs.statSync(file)
				        if (stat && stat.isDirectory()) results = results.concat(walk(file))
				        else results.push(file.replace(root+'/',''))
			        }
			    })
			    return results
			}
			
			var files = walk(root);
			
			files = new Set(files);
			files.delete('index.html')
			
			//var files = fs.readdirSync('./html/layouts');
			//console.log(files)
			var index = [];
			
			/*for(var i=0; i<files.length; i++){
				if(files[i] != 'index.html'){
					console.log(fs.lstatSync('./html/layouts/'+files[i]).isDirectory())
					if(!files[i].startsWith('_')){
						index.push(files[i]);
					}
				}
			}*/
			
			files.forEach(function(value){
				index[value] = value.replace('.html','').replace('_',' ').replace('/',' / ').replace(/\b\w/g, l => l.toUpperCase());
			})
			
			htmlPluginData.plugin.options.index = index;
			//console.log(htmlPluginData);
			
			callback(null, htmlPluginData);
			
		})
		
	})
	
}

module.exports = Indexer;