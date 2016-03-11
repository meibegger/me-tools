# meTools #

A collection of utility functions.

## Usage ##

### 1. Include the JavaScript ###
#### Precompiled & minified versions ####
Include `me-tools.min.js` and `me-tools.min.css` included in the `dist` folder in your HTML page.

#### Source versions ####
You can find the original JavaScript files in the `src` folder of this package.

#### AMD ####
meLockView has AMD support. This allows it to be lazy-loaded with an AMD loader, such as RequireJS.

### 2. Define your view ###
Wrap your main page content in a container and set the attribute `data-me-view=""` on this element.

```html
<div data-me-view="">
  YOUR CONTENT GOES HERE
</div>
```

### 2. meTools Functions ###
#### Variable functions ####

Create a copy of a variable.

```javascript
meTools.copyValues(vals [, deep])
```

* @param vals mixed
* @param deep bool; optional; deep-copy; default is true
* @returns mixed; a copy of the passed value
 
---

Merge 2 objects and return a copy.

```javascript
meTools.mergeObjects(object1, object2)
``` 

* @param object1 Object
* @param object2 Object
* @returns {{}} New merged Object

---

Check if an object is empty.

```javascript
meTools.isEmptyObject(object)
```

* @param object Object
* @returns {boolean}

#### DOM element handlers ####

Get a specified element.

```javascript
meTools.getElementById(elementSpec)
```

* @param elementSpec mixed; string (id of the element) or element;
* @returns {*} element or null

---

Get the ID of an element. If the element has no ID, it will be assigned a random ID.

```javascript
meTools.getId(element [, prefix])
```

* @param element DOM element
* @param prefix string; optional; A prefix for generated IDs; default is 'id-'
* @returns {string} ID

---

Get all ancestors of an element, possibly matching a selector, up to an optional container.
 
```javascript
meTools.getAncestors(element [, selector] [, container] [, single])
```
 
* @param element DOM-Element;
* @param selector String; optional; selector to match the parents against
* @param container DOM-Element; optional; max parent to check; default is body
* @param single Boolean; optional; return only the next matching ancestor
* @return array

---

Check if an element is the parent of another element.

```javascript
meTools.isParent(parent, child)
```

* @param parent DOM-element
* @param child DOM-element
* @returns {boolean}

#### Event handling ####

Add an event-listener and register it to an instance.
The instance will get a property 'registeredEvents' storing the registered events.

```javascript
meTools.registerEvent(scope, target, type, fn [, capture])
```

* @param scope object; instance to register the event to
* @param target DOM object; event target
* @param type string; event name
* @param fn function; event handler
* @param capture boolean; optional; capture the event; default is false

___

Remove (an) event-listener(s), previously registered to an instance.

```javascript
meTools.unregisterEvent(scope [, target] [, type] [, fn] [, capture])
```

* @param scope object; instance the event was registered to
* @param target DOM object; optional; event target; if not set, matching events will be removed on all targets
* @param type string; optional; event name; if not set, all event-types will be removed
* @param fn function; optional; event handler; if not set, all event-handlers will be removed
* @param capture boolean; optional; if not set, captured & not-captured events are removed, if true only captured events are removed, if false only not-captured events are removed
         
___

Rate-limit the execution of a function (e.g. for events like resize and scroll).
Returns a new function, that when called repetitively, executes the original function no more than once every delay milliseconds.

```javascript
meTools.throttle(fn [, threshhold] [, trailing] [, scope])
```

* @param fn function; original function to call
* @param threshhold int; optional; delay (ms) - execute fn no more than once every delay milliseconds; default is 250
* @param trailing boolean; optional; execute fn after the calls stopped; default is true
* @param scope object; optional; instance the function should be applied to
* @returns {Function}

___

Coalesce multiple sequential calls into a single execution at either the beginning or end (e.g. for events like keydown).
Returns a new function, that when called repetitively, executes the original function just once per “bunch” of calls.

```javascript
meTools.debounce(fn [, pause] [, beginning] [, scope])
```

* @param fn function; original function to call
* @param pause int; optional; min pause (ms) between bunches of calls; default is 250
* @param beginning boolean; execute at the beginning of the call-bunch; default is false
* @param scope object; optional; instance the function should be applied to
* @returns {Function}

## Package managers ##
You can install meTools using npm or bower.

```
$ npm install me-tools
```

or

```
$ bower install me-tools
```

## License ##
meTools is licensed under the [MIT licence](https://opensource.org/licenses/MIT).