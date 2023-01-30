"use strict";
class $a2e9b4462539c6ec$export$a95a4cd6238f6cba {
    /**
     * WordEvent constructor
     *
     * @constructs WordEvent
     * @param {Object} options - the class options object:
     * @param {String|Element} [options.target=document] - the element to which attach the keyboard event
     * @param {Integer} [options.digitInterval=500] - time interval (ms) used to consider characters belonging to the same word
     * @param {String} [options.eventType='keyup'] - the keyboard event type
     * @param {Function} [options.acceptedCode] - the function used to check if a typed char can be accepted and so can form part of the word or not, by default all alpha-numerical characters are accepted [a-z0-9]. The function is invoked passing the parameter evt which is the event object, and must return true if it is accepted, false otherwise.
     * @example
     *    var we = new WordEvent({digitInterval: 400, acceptedCode: function(evt) {return (evt.keyCode>47 && evt.keyCode<58) : false; // only numbers}});
     */ constructor(options = {}){
        this.target = options.target || document;
        this.digitInterval = options.digitInterval || 500;
        this.eventType = options.eventType || "keyup";
        this.acceptedCode = options.acceptedCode || function(evt) {
            return evt.keyCode > 47 && evt.keyCode < 58 || evt.keyCode > 64 && evt.keyCode < 91 || false;
        };
        this.dictionary = {
            string: [],
            rexp: []
        };
    }
    /**
     * Adds the given words and callbacks to the dictionary, parameters can be a pair of word and callback or two arrays of words and callbacks (tied through indexes)
     *
     * @param {String|Array} words - words to add to the dictionary, a single word can be a string or a regular expression
     * @param {Function|Array} callbacks - callbacks to call when the word event is fired. The callbacks are binded to the target element and are passed the array of event objects which generated the word.
     * @return {void}
     */ listen(words, callbacks) {
        words = words instanceof Array ? words : [
            words
        ];
        callbacks = callbacks instanceof Array ? callbacks : [
            callbacks
        ];
        for(let i = 0, l = words.length; i < l; i++)if (words[i] instanceof RegExp) this.dictionary.rexp[words[i]] = callbacks[i];
        else this.dictionary.string[words[i]] = callbacks[i];
    }
    /**
     * Removes the the given words from the dictionary. Parameter can be a single word or an array of words.
     *
     * @param {String|Array} words - words to remove from dictionary
     * @return {void}
     */ unlisten(words) {
        words = words instanceof Array ? words : [
            words
        ];
        for(let i = 0, l = words.length; i < l; i++)delete this.dictionary[words[i] instanceof RegExp ? "rexp" : "string"][words[i]];
    }
    /**
     * Class activation, the class starts listening to typed words
     *
     * @return {void}
     */ activate() {
        const self = this;
        // closure to construct the word
        let word = "";
        let events = [];
        let lastTime = null;
        let wordCtrl = {
            checkTime: function() {
                var time = new Date().getTime();
                var result = lastTime === null || time - lastTime <= self.digitInterval || false;
                lastTime = time;
                return result;
            },
            append: function(evt) {
                if (self.acceptedCode(evt)) {
                    word += evt.key;
                    events.push(evt);
                }
            },
            read: function() {
                return word;
            },
            events: function() {
                return events;
            },
            reset: function() {
                word = "";
                events = [];
            }
        };
        this.target.addEventListener(this.eventType, this.elistener = function(evt) {
            self.eventListener(evt, wordCtrl);
        });
    }
    /**
     * Class deactivation, the class stops listening to typed words
     *
     * @return {void}
     */ deactivate() {
        this.target.removeEventListener(this.eventType, this.elistener);
    }
    /**
     * Method called every time the eventType is fired
     *
     * @description Sets a timeout to dispatch the word event, such timeout is cleared if the next character is typed before the end of digit_interval milliseconds.
     * @param {Event} evt - the fired event
     * @param {Object} wordCtrl - the wordCtrl instance
     * @return {void}
     */ eventListener(evt, wordCtrl) {
        if (wordCtrl.checkTime()) {
            clearTimeout(this.to);
            wordCtrl.append(evt);
        } else {
            wordCtrl.reset();
            wordCtrl.append(evt);
        }
        this.to = setTimeout(this.dispatch.bind(this, wordCtrl), this.digitInterval);
    }
    /**
     * Executes the callback for the typed word if it is included in the dictionary
     *
     * @param {Object} wordCtrl - the wordCtrl instance
     * @return {void}
     */ dispatch(wordCtrl) {
        const callback = this.find(wordCtrl.read());
        if (callback) callback.call(this.target, wordCtrl.events(), wordCtrl.read());
    }
    /**
     * Checks if the typed word belongs to dictionary, and in that case return its callback.
     * First it checks strings then regular expressions.
     *
     * @param {String} word - the typed word
     * @return {Function} matching callback function or null
     */ find(word) {
        // strings
        if (typeof this.dictionary.string[word] !== "undefined") return this.dictionary.string[word];
        // regexp
        for(let key in this.dictionary.rexp)if (this.dictionary.rexp.hasOwnProperty(key)) {
            var rexp = new RegExp(key.substring(1, key.length - 1));
            if (rexp.test(word)) return this.dictionary.rexp[key];
        }
        return null;
    }
}
window.WordEvent = $a2e9b4462539c6ec$export$a95a4cd6238f6cba;


export {$a2e9b4462539c6ec$export$a95a4cd6238f6cba as WordEvent};
//# sourceMappingURL=js-word-event.module.mjs.map
