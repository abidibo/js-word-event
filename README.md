# js-word-event

This is a library which provides a `WordEvent` class that can be used to attach listeners to typed word events.

Example:
```
var kw = new WordEvent();
var searchme = (events) => console.log(events);
kw.listen(['lol', /^7[a-z]*/], [function(evts) { alert('lol'); }, searchme]);
kw.activate();
```
Available options:

- `target`: the DOM element where key events are attached. Default: document
- `digitInterval`: time interval (ms) used to consider characters belonging to the same word. Default: 500
- `eventType`: the keyboard event type. Default: keyup
- `acceptedCode`: the function used to check if a typed char can be accepted and so can form part of the word or not, by default all alpha-numerical characters are accepted [a-z0-9]. The function is invoked passing the parameter evt which is the event object, and must return true if it is accepted, false otherwise. Default: function which accpets numbers and letters

Example:
```
var kw = new WordEvent({
    target: document.getElementById('my-div'),
    digitInterval: 300,
    eventType: 'keydown',
    acceptedCode: (evt) => ((evt.keyCode > 47 && evt.keyCode < 58) || (evt.keyCode > 64 && evt.keyCode < 91)) || false
});
```
