*AudiJs!*
-----------------------------------------------

A tiny javascript Text-To-Speech library based on the browsers Native API

Audi has no dependencies, it weighs 5kb, and its free to use and modify under the MIT license.

### INSTALLATION 

Audi can be downloaded from the AudiJs github repo (https://github.com/gbenga504/AudiJs). It can also be installed using bower

### Bower INSTALLATION


Demo & Tutorial
---------------
[Play with some live speech recognition demos]


Hello World
-----------
```<script src="__LOCATION__TO__AUDI_FILE"></script>
<script>
	//init Audi with the local attribute to use the browsers native speech API 
	var audiSpeaker = new Audi("local");
	
	//using Audi methods without callbacks 
	audiSpeaker.read("I love the day called Christmas");
	audiSpeaker.dictate(["coding", "is", "life"]);
	
	//with a call back 
	audiSpeaker.read("Futarians are here to stay", function(){
		console.log('done');
	})
</script>
```

***Check out some demo on youtube @



PHASE
-----------
Audi is still in its first phase and we believe there is a lot of work to be done on the library.. So start pulling , coding and making pull requests


Author
------
gbenga504 ,  Badewa ....... check list of contributors and details from CONTRIBUTING.md



License
-------
Licensed under [MIT](https://github.com/gbenga504/AudiJs/blob/master/LICENSE).




