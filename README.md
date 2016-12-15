*AudiJs!*
-----------------------------------------------

A tiny javascript Text-To-Speech library based on the browsers Native API

Audi has no dependencies, it weighs 5kb, and its free to use and modify under the MIT license.

### INSTALLATION 

Audi can be downloaded from the AudiJs github repo (https://github.com/gbenga504/AudiJs). It can also be installed using bower

### Bower INSTALLATION
bower install Audi --save


Demo & Tutorial
---------------
[Play with some live speech recognition demos]
https://youtu.be/zhuK1OoN1nE

Hello World (QUICK EXAMPLE)
-----------
	//init Audi with the local attribute to use the browsers native speech API 
	var audiSpeaker = new Audi("local");
	
	//using Audi methods without callbacks 
	audiSpeaker.read("I love the day called Christmas");
	audiSpeaker.dictate(["coding", "is", "life"]);
	
	//with a call back 
	audiSpeaker.read("Futarians are here to stay", function(){
		console.log('done');
	})
	

INITILAIZING 
-------------
This can be done in two ways, i.e using either the local service which uses the browsers native speech API or using the online service which uses the google Text-To-Speech API... However, if no parameter is selected then it defaults to online service 

	//using local service 
	var myAudi = new Audi("local");
	
	//using online service
	var myAudi = new Audi("online");
	
	
LANGUAGE SELECTION
------------------
Language is automatically selected for teh user if one uses the local service.... This is because it is difficult to predict if the user speaks english or any other particular language.. Audi therefore selects default language for the user using the users computer

	//gets the list of languages available to the user  
	myAudi.getLangList
	
	//gets the current language (getter Method)
	myAudi.lang
	
	//sets the current language (arg accepts only strings)
	myAudi.lang = 'en'
	
METHODS AVAILABLE TO AUDIJS
-------------------------
- [x] read(string) -- used to read words
- [x] dictate(Array) ---- accepts an array and dictates its contents
- [x] toArray(string, splitter(optional)) ----- splits a string based on the splitter provided and if the splitter results to undefined or is not provided , it splits the string based on an empty string ' '
- [x] volume, rate, lang, pitch  --- all have getter and setter methods .. All but lang accept a type float, number or integer between 0.1 - 1 for its setter.. while lang only accept a type string for its setter 
  
  
***Check out some demo on youtube @
https://youtu.be/zhuK1OoN1nE


PHASE
-----------
Audi is still in its first phase and we believe there is a lot of work to be done on the library.. So start pulling , coding and making pull requests


Author
------
gbenga504 ,  Badewa ....... check list of contributors and details from CONTRIBUTING.md

License
-------
Licensed under [MIT](https://github.com/gbenga504/AudiJs/blob/master/LICENSE).

