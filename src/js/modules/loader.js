const loadjs = require('loadjs');

module.exports = function(config){
	
	return {
		
		key: function(key, callback){
			try {
				let self = this;
				if(config[key].deps){
					let loaded = 0;
					config[key].deps.forEach(function(value){
						self.key(value, function(){
							loaded++;
							if(loaded == config[key].deps.length){
								loadjs(config[key].files, key, {
									success: callback
								});
							}
						})
					});
				}else{
				
					loadjs(config[key].files, key, {
						success: callback
					});
				}
			} catch(e){
				loadjs.ready(key, {
					success: callback
				});
			}
		},
		
		src: function(url, key, callback){
			try {
				loadjs(url, key, {
					success: callback
				});
			} catch(e){
				loadjs.ready(key, {
					success: callback
				});
			}
		}
	
	}
	
}