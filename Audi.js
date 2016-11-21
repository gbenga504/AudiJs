/*!
 * Audi JavaScript Library v1.0
 * author : Anifowoshe Gbenga David @Gad
 * license : MIT
 */

(function (global,factory) {
    "use strict";

    if(typeof define === 'function' && define.amd){ // AMD + global
        define([], function () {
            return (global.Audi = factory(global));
        });
    }
    else if(typeof module === "object" && typeof module.exports === "object"){
        //For commonJs environment and its environment like libraries
        //For nodeJs community which also uses window and not a document based interface for operation
        //we try to take care of the discrepancy between this libraries in that environment and in a nodeJs like type of environs
        //Audi needs a document for the service based version of the library
        //so throw Error if a document is not found
        module.exports = global.document ? global.Audi = factory(global) :
            function (win) {
                if(!win.document){
                    throw new Error("Audi requires a document to run by default");
                }
                return global.Audi = factory(win);
            }
    }
    else{
        //for the browser based globals (We also try to tell the user that a document is required)
        global.document ? global.Audi = factory(global) : (function () {
            throw new Error("Audi requires a document to run by default");
        })();
    }
})(typeof window !== undefined ? window : this,  function (global) {
    var Audi;


    //We try to get the speech Object which belongs to the global window object
    var speechSynthesis = global.speechSynthesis;
	var speechUtterance = new SpeechSynthesisUtterance();

    var defaultAudiEngine = "online";
    var defaultLang = "en-US";
    var version = "1.0";
    var defaultRate = 1;
    var defaultPitch = 1;
    var defaultVolume = 1;
    var isSupported = true;
	var audiServiceDOMHandler;
	var NS_TTYL = "https://translate.google.com/translate_tts?";
    var audioTypePattern = /^(local)$|^(online)$/i;


    //This handles Logging messages to the console
    var consoleMessage = function (message) {
		console.log(message);
    };

	
    //This handles assembling words for dictation
    var assembleDictatableWords = function (usrArray) {
        var str = "";
		usrArray.forEach(function (item) {
			str += item + "...";
		});
		return str;
    };


    //The language for the local service is selected from the users computer by default;
    var localDefaultLang = function (speechObject) {
        if(speechSynthesis) {
            //getVoices() produces an array of language objects currently installed on the user's computer
            //Audi uses the first language.. of the array as the default
            var available_voices = speechObject.getVoices();
            var default_lang = available_voices[0].lang;
            return default_lang;
        }
    };


    //An audio HTML[ELEMENT] is needed for the online based Audio type
	//This audio object is used for all instances of the online Audi service created
    var createAudio = function () {
        if(global.document.getElementById("audiService" + version.replace(".","")) == null){
            var audio = new global.Audio();
			audio.setAttribute("id","audiService" + version.replace(".",""));
            global.document.body.appendChild(audio);
			audiServiceDOMHandler = audio;
        }
    };
	
	
	/**
	* @param {function} echoEngineType shows the engine version that Audi is currently running
	*/
	var echoEngineType = function(){
		consoleMessage("Audi.js (v" + version + ") launched");
	};

	
	/**
	* invokeCallback runs all the callbacks from the local and online service audio's 
	*@param {string} [localCommand] signifies the command stream for the local Audi service
	*@param {string} [serviceCommand] signifies the command stream for the service Audi service 
	*@param {Object} [o] this points to the *** this ** of the Audi object
	*@param {string} [message == null] can be null by default
	*@param {function} [callback == null] the function the user intends to call after adding an operational event listener 
	*/
	var invokeCallbacks = function(localCommand,serviceCommand,o,message,callback){
		if(/^(local)$/.test(o.AudioType)){
			speechUtterance[localCommand] = function(){
				message !== undefined && message !== null && typeof(message) == "string" ? consoleMessage(message) : consoleMessage("");
				if(callback !== null && callback !== undefined && typeof callback == "function"){
					callback();
				}
				else if(callback !== null && callback !== undefined && typeof callback !== "function"){
					consoleMessage("WARNING %e% :: A function callback is required");
				}
			}
        }
        else{
			audiServiceDOMHandler.addEventListener(serviceCommand, function(){
				message !== undefined && message !== null && typeof(message) == "string" ? consoleMessage(message) : consoleMessage("");
				if(callback !== null && callback !== undefined && typeof callback == "function"){
					callback();
				}
				else if(callback !== null && callback !== undefined && typeof callback !== "function"){
					consoleMessage("WARNING %e% :: A function callback is required");
				}
			});
        }
	};
	
	
	var getLanguages = function(o){
		var languageDefaults = [];
		if(/^(local)$/.test(o.AudioType)){
			var available_voices = speechSynthesis.getVoices()
			available_voices.forEach(function(item){
				if(languageDefaults.indexOf(item.lang) == -1){
					languageDefaults.push(item.lang);
				}
			});
        }
        else{
			//This are the defaults languages for service based Type of the API 
			languageDefaults = ['en-US','ja','es-ES','ru','ar-EG'];
        }
		return languageDefaults;
	};
	
	
    Audi = function (AudioType, lang) {
        /**
         * Audi uses the Local and the online service based Audio
         * LOCAL TYPE >> This type is generated from the users computer based on the user's geographical region
         * SERVICE TYPE >> This type is generated using Google's text-to-speech engine which requires network access as it uses a GET request
         * Set the AudioType to online by default if it is not set well by the user
         * Audi tries to check the user's audio type to see if an error occurs while setting
         * A warning but not an interruption is generated if the audio type is not correctly set
         * @param  {string} [default] This are the parameters that Audi listens to
         */
        if(!audioTypePattern.test(AudioType)){
            consoleMessage("Audio type not correctly set {onlin | local} required>> SWITCHED TO ONLINE BY DEFAULT");
            this.AudioType = defaultAudiEngine; //default
			createAudio();
			defaultLang = lang !== undefined && lang !== null ? lang : defaultLang;
        }
        else{
            // we check for browser support
            //we do this early enough when the Object is instantiated
            if(/^(local)$/.test(AudioType)){
                if(!speechSynthesis){
                    throw new Error("Your browser does not support Audi(Local), /n" +
                        "use online Audio Type for a wide range of browser support");
                    isSupported = false;
                    return;
                }
                else{
                    this.AudioType = AudioType;
					/**
					* Audi does not support users selecting language when instantiating object
					* Users system languages differs with geographical region
					* @param {Array} of getVoices() of the speech API is selected with reference to the first element in the array as the first 
					*/
					defaultLang = localDefaultLang(speechSynthesis);
                }
            }
            else{
                this.AudioType = AudioType;
				createAudio();
                defaultLang = lang !== undefined && lang !== null ? lang : defaultLang;
            }
        }
    };
	
	
	/**
	* Define Getters and Setters for Audi
	* This could be used to reach out to a lot of functions such as volume, rate, pitch, lang
	*/
	Audi.prototype.__defineGetter__('volume', function(){
		return defaultVolume;
	});
	
	
	Audi.prototype.__defineGetter__('paused', function(){
		if(/^(local)$/.test(this.AudioType)){
			return speechSynthesis.paused;
		}
		else{
			return audiServiceDOMHandler.pause;
		}
	});
	
	
	Audi.prototype.__defineGetter__('speaking', function(){
		if(/^(local)$/.test(this.AudioType)){
			return speechSynthesis.paused;
		}
		else{
			return !audiServiceDOMHandler.paused;
		}
	});
	
	
	Audi.prototype.__defineSetter__('volume', function(val){
		var _volume = parseFloat(val);
		if(_volume !== NaN){
			defaultVolume = _volume;
		}
		else{
			//Audi swallows the error and just consoles a message the user 
			consoleMessage("Volume not set::>> REASON an entity which is not a number or float was assigned to volume");
		}
	});
	
	
	Audi.prototype.__defineGetter__('rate', function(){
		return defaultRate;
	});
	
	
	Audi.prototype.__defineSetter__('rate', function(val){
		if(/^(local)$/.test(this.AudioType)){
			var _rate = parseFloat(val);
			if(_rate !== NaN){
				defaultRate = _rate;
			}
			else{
				//Audi swallows the error and just consoles a message the user 
				consoleMessage("Rate not set::>> REASON an entity which is not a number or float type was assigned to rate");
			}
		}
		else{
			//Audi does not assign..... The online based does not contain the RATE Property 
		}
	});
	
	
	Audi.prototype.__defineGetter__('pitch', function(){
		return defaultPitch;
	});
	
	
	Audi.prototype.__defineSetter__('pitch', function(val){
		if(/^(local)$/.test(this.AudioType)){
			var _pitch = parseFloat(val);
			if(_pitch !== NaN){
				defaultPitch = _pitch;
			}
			else{
				//Audi swallows the error and just consoles a message the user 
				consoleMessage("Pitch not set::>> REASON an entity which is not a number or float type was assigned to pitch");
			}
		}
		else{
			//Audi does not assign... The service based does not contain the RATE Property 
		}
	});
	
	
	Audi.prototype.__defineGetter__('lang', function(){
		return defaultLang;
	});
	
	
	Audi.prototype.__defineSetter__('lang', function(val){
		if(typeof val == "string"){
			defaultLang = val;
		}
		else{
			consoleMessage("Language not set!! cannot set language.. Make sure language is of type STRING");
		}
	});
	
	
	Audi.prototype.__defineGetter__('getLangList', function(){
		return getLanguages(this);
	});
	
	
	//Utility function
    Audi.prototype.toArray = function (str,splitter) {
        if(typeof str !== "string"){
            consoleMessage("WARNING %e% :: Invalid Object type supplied, Require:: String");
            return;
        }
        else{
            splitter = splitter !== undefined ? splitter : " ";
            return str.split(splitter);
        }
    };

    /**
     * Equip Audi with a list of commands that help in rendering speech to the user
     * @param {Object} commands - Commands that Audi should listen to
     * @param {object} of prototypes attached to the Audi Object
     */

    Audi.prototype.onstart = function (message,callback) {
		var _this = this;
		invokeCallbacks("onstart","canplaythrough",_this,message,callback);
    };
	
	
	Audi.prototype.onend = function(message,callback){
		var _this = this;
		invokeCallbacks("onend","ended",_this,message,callback);
	};
	
	
	Audi.prototype.onpause = function(message,callback){
		var _this = this;
		invokeCallbacks("onpause","pause",_this,message,callback);
	};
	
	
	/**
	* start, pause and end are equipped functions of Audi
	* @param {object-property} [start] is called automatically when attempts are made to read 
	* @param {object-property} [pause] 
	* @param {object-property} [resume]  
	* @param {object-property} [stop] 
	*/
	Audi.prototype.start = function(message){
		//the message is only used by the local type 
		if(/^(local)$/.test(this.AudioType)){
			speechUtterance.text = message;
			speechUtterance.pitch = defaultPitch;
			speechUtterance.rate = defaultRate;
			speechUtterance.volume = defaultVolume;
			speechUtterance.lang = defaultLang;
			speechSynthesis.speak(speechUtterance);
        }
        else{
			audiServiceDOMHandler.volume = defaultVolume;
			var src = NS_TTYL + "?tl=" + defaultLang + "&q=" + message;
			audiServiceDOMHandler.setAttribute("src",src);
			audiServiceDOMHandler.play();
        }
	};
	
	
	Audi.prototype.pause = function(){
		if(/^(local)$/.test(this.AudioType)){
			speechSynthesis.pause();
        }
        else{
			audiServiceDOMHandler.pause();
        }
	};
	
	
	Audi.prototype.resume = function(){
		if(/^(local)$/.test(this.AudioType)){
			speechSynthesis.resume();
        }
        else{
			audiServiceDOMHandler.play();
        }
	};
	
	
	Audi.prototype.stop = function(){
		if(/^(local)$/.test(this.AudioType)){
			speechSynthesis.cancel();
        }
        else{
			audiServiceDOMHandler.pause();
			audiServiceDOMHandler.currentTime = 0;
        }
	};
	
	
	/**
	* Equip Audi with the methods to read and dictate 
	* Read should be used when attempts are made to read a message or text 
	* @param {string} [message] is the message to be read which can be provided
	* @param {function} [callback] is an optional function that would be called after the message has been read 
	*/
	Audi.prototype.read = function(message,callback){
		//we have to try to check if the type is the local or the online service based Audi
		if(typeof message == "string" && message !== undefined && message !== null){
			this.start(message);
			if(callback && typeof callback == "function"){
				this.onend(null,callback);
			}
			//Re-initiliaze the speech utterance to speak again
			speechUtterance = new SpeechSynthesisUtterance();
		}
		else if(typeof message !== string){
			throw new Error("Audi needs to take a message of type >> STRING");
		}
		else{
			//do nothing for now
		}
	};
	
	
	/**
	* Dictate should be used when words are to be read sequentially slow like in a dictation
	* @param {array} [usrArray] arrays of words to dictate 
	* @param {function} [callback] is an optional function that would be called after the message has been dictated
	*/
	Audi.prototype.dictate = function(usrArray,callback){
		if(typeof usrArray == "object" && usrArray instanceof Array){
			var message = assembleDictatableWords(usrArray);
			this.start(message);
			if(callback && typeof callback == "function"){
				this.onend(null,callback);
			}
			//Re-initiliaze the speech utterance to speak again
			speechUtterance = new SpeechSynthesisUtterance();
		}
		else{
			consoleMessage("WARNING %e% :: Invalid object type supplied, Require:: Array");
			return;
		}
	};
	
	echoEngineType(this);
	return Audi;
	
});

/**
*	### Quick Example:
*	````html
*	
*	<script>
*		//The callback attached to the read or dictate function is optional  
*		//If it is not provided, then the message is just read out loud and nothing else happens 
*		* var speaker = new Audi();	//In this case the online based service API is used 
*		* speaker.read("wow!!!, this works");
*		* speaker.read("wow!!!, this works", function(){
*			console.log('The speech has ended');
*		});
*	
*
*	### USING DICTATE FOR THE API 
*		* var speaker2 = new Audi('local');
*		//Dictate reads the words one at a time 
*		* speaker.dictate(['elephant','Gbenga','Nigeria'], function(){
*			console.log('I am done with dictating');
*		});
*	
*
*	### HELPER FUNCTION TO ARRAY CAN BE USED WITH THE STRING TO CONVERT THE STRING TO AN ARRAY 
*		*speaker.dictate(speaker.toArray("I stay in England"), function(){
*			console.log('just told them where I stay');	
*		})
*		//Note that the above can also be used without any callbacks
*
*
*
*	### GETTING THE LIST OF SUPPORTED OR DEFAULT LANGUAGES 
*	//Since Audi is categorized to the local and online service 
*	//The local service type gets its language settings only from the users computer
*	//This is so as the langauge of each user would depend on geographical region 
*	//On most cases the user would have 2 sets of language object installed on his local machine 
*	
*	//The online has a lot of language setting defined with it 
*	//But Audi limits the default to 5 sets of languages 
*	//This can however be extended by the user using the 
* 	soeaker2.lang = "language name here";	//and it would be set based on the supplied string 
*	
*	//Use the code below to get the list of languages that audi supports based on the service type choosen after instantiating the object 
*	console.log(speaker2..getLangList);
*
*
*
*
*	### SETTING PROPERTIES (SETTERS AND GETTERS)
*	* volume //can be set for all type of Audi types
*	* rate, pitch can only be set for the local service type 
*	//This can only take float point numbers from 0-1 - 1
*	* speaker2.volume = 0.5
*	</script>
*	````
*/
