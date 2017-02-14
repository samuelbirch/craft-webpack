import '../css/main.scss';

const load = require('./modules/loader')({
	'jquery' : {files:['//code.jquery.com/jquery-3.1.1.slim.js']},
	'select2': {files:['//cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js'], deps:['jquery']},
});


load.key('jquery', function(){
	console.log('jquery loaded')
})

load.key('select2', function(){
	console.log('select2 loaded')
})
