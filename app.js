var express = require('express');
var app = express();

const randomWords = (function(){
		var words = [];

		return{
			getWords : function(){
				return words;
			},
			addWord :function(word){
				if(word != undefined){
					words.push(word);
				}
				return words.length;
			},
      clear : function(){
        words = [];
      }
		}

})();

const decodeWords = {
	getWord : function(text,maxLength){
		var word = text.substring(text.indexOf('<header'),text.indexOf('</header')).replace(/<(.|\n)*?>/g, '').replace('.','');
		if(word.indexOf(',') != -1){
			word = word.substring(0,word.indexOf(','));
		}
		if(new RegExp('[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]').test(word[word.length-1])){
			word = word.substr(0,word.length-1);
		}
		if(word.length > maxLength || word.length < 4 || word.indexOf('_') > -1){
			word = undefined;
		}
		return word;
	}
}

function getNwords(nWords,maxLength){

		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var xmlHttp = new XMLHttpRequest();
	  xmlHttp.onreadystatechange = function() {
	      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
					if(randomWords.addWord(decodeWords.getWord(xmlHttp.responseText,maxLength)) < nWords){
							getNwords(nWords,maxLength);
					}else{
						return;
					}
	      }else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
	          console.log("Error: " + xmlHttp.readyState + ", " + xmlHttp.status + ", " + xmlHttp.responseText);
						getNWords(nWords,maxLength);
	      }
	  }
		xmlHttp.open('GET', 'http://dle.rae.es/srv/random', false);
		xmlHttp.send();
	}

  app.get('/word/', function (req, res) {
    console.log('Llamada a getWords');
    randomWords.clear();
    getNwords(req.query.nwords,req.query.maxlength);
    console.log('Enviar palabra ' + randomWords.getWords());
    //res.set('Content-Type','text/plain');
		res.set('Access-Control-Allow-Origin','*');
    res.send(randomWords.getWords());
  });

  var port = 3000;
  app.listen(port, function () {
    console.log('Word generator ready on port ' + port);
  });
