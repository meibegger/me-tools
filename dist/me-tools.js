/**
 * @license me-tools 1.0.2 Copyright (c) Mandana Eibegger <scripts@schoener.at>
 * Available via the MIT license.
 * see: https://github.com/meibegger/me-tools for details
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('meTools.fn.variable', [
    ], factory);
  } else if(typeof exports === 'object') {
    if (typeof module === 'object') {
      module.exports = factory();
    } else {
      exports['meTools.fn.variable'] = factory();
    }
  } else {
    root.meTools = root.meTools || {};
    root.meTools.fn = root.meTools.fn || {};
    root.meTools.fn.variable = factory();
  }
}(this, function () {

  /*
   ---------------
   functions
   ---------------
   */

  /**
   * Create a copy of a variable.
   *
   * copyValues(vals [, deep])
   *
   * @param vals mixed
   * @param deep bool; optional; deep-copy; default is true
   * @returns {*} mixed; a copy of the passed value
   */
  function copyValues(vals, deep) {
    deep = (typeof(deep) === 'undefined') || deep;

    var copy,
      val;
    if (Array.isArray(vals)) {
      copy = [];
      for (var i in vals) {
        val = vals[i];
        copy.push((deep && typeof val === 'object') ?
          copyValues(val)
          : val);
      }

    } else if (vals && typeof(vals) === 'object' && typeof(vals.tagName) === 'undefined') {
      copy = {};
      for (var key in vals) {
        val = vals[key];
        copy[key] = (deep && typeof val === 'object') ?
          copyValues(val)
          : val;
      }

    } else {
      copy = vals;
    }
    return copy;
  }

  /**
   * Merge 2 Objects and return a copy.
   *
   * mergeObjects(object1, object2)
   *
   * @param object1 Object
   * @param object2 Object
   * @returns {{}} New merged Object
   */
  function mergeObjects(object1, object2) {
    object1 = object1 || {};
    object2 = object2 || {};
    var result = {};
    for (var key1 in object1) {
      var option1 = object1[key1];
      if (object2.hasOwnProperty(key1)) {
        var option2 = object2[key1];
        if (Array.isArray(option2) || typeof(option2) !== 'object' || typeof(option1) !== 'object') {
          result[key1] = copyValues(option2);
        } else {
          result[key1] = mergeObjects(option1, option2);
        }
      } else {
        result[key1] = copyValues(option1);
      }
    }
    for (var key2 in object2) {
      if (!result.hasOwnProperty(key2)) {
        result[key2] = copyValues(object2[key2]);
      }
    }
    return result;
  }

  /**
   * Check if an object is empty.
   *
   * isEmptyObject(object)
   *
   * @param object Object
   * @returns {boolean}
   */
  function isEmptyObject(object) {
    for (var i in object) {
      return false;
    }
    return true;
  }

  /*
   ---------------
   api
   ---------------
   */

  return {
    copyValues: copyValues,
    mergeObjects: mergeObjects,
    isEmptyObject: isEmptyObject
  };

}));

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('meTools.fn.element', [
    ], factory);
  } else if(typeof exports === 'object') {
    if (typeof module === 'object') {
      module.exports = factory();
    } else {
      exports['meTools.fn.element'] = factory();
    }
  } else {
    root.meTools = root.meTools || {};
    root.meTools.fn = root.meTools.fn || {};
    root.meTools.fn.element = factory();
  }
}(this, function () {

  /*
   ---------------
   functions
   ---------------
   */

  /**
   * Get the specified element.
   *
   * getElementById(elementSpec)
   *
   * @param elementSpec mixed; string (id) or element;
   * @returns {*} element or null
   */
  function getElementById(elementSpec) {
    if (typeof(elementSpec) === 'object' && typeof(elementSpec.tagName) !== 'undefined') {
      return elementSpec;

    } else if (typeof(elementSpec) === 'string') {
      return document.getElementById(elementSpec);

    } else {
      return null;
    }
  }

  /**
   * Get the ID of an element. If the element has no ID, it will be assigned a random ID.
   *
   * getId(element [, prefix])
   *
   * @param element DOM element
   * @param prefix string; optional; A prefix for generated IDs; default is 'id-'
   * @returns {string} ID
   */
  function getId(element, prefix) {
    var id = element.getAttribute('id');

    if (!id) { // assign an ID
      prefix = prefix || 'id-';
      do {
        var date = new Date();
        id = prefix + Math.ceil(date.valueOf() % 10000 * Math.random());
      } while (document.getElementById(id));

      element.setAttribute('id', id);
    }

    return id;
  }

  /**
   * Get all ancestors of an element, possibly matching a selector, up to an optional container.
   *
   * Note: this function uses matches(selector), so you need to include a polyfill for all IEs!
   *
   * getAncestors(element [, selector] [, container] [, single])
   *
   * @param element DOM-Element;
   * @param selector String; optional; selector to match the parents against
   * @param container DOM-Element; optional; max parent to check; default is body
   * @param single Boolean; optional; return only the next matching ancestor
   * @return mixed; array or false/element if single===true
   */
  function getAncestors(element, selector, container, single) {
    // prepare arguments
    var
      argSelector = false,
      argContainer = false,
      argSingle = false;
    for (var i = 1; i < arguments.length; i++) {
      switch (typeof(arguments[i])) {
        case 'string':
          argSelector = arguments[i];
          break;
        case 'object':
          argContainer = arguments[i];
          break;
        case 'boolean':
          argSingle = arguments[i];
          break;
      }
    }
    selector = argSelector;
    container = argContainer || document.body;
    single = argSingle;

    var parents = [],
      getAncestors = function (element) {
        var parent = element.parentElement;
        if (!selector || parent.matches(selector)) {
          if (single) {
            return parent;
          } else {
            parents.push(parent);
          }
        }
        if (parent === container) {
          return single ? false : parents;
        }
        return getAncestors(parent);
      }
      ;
    return getAncestors(element);
  }

  /**
   * Check if an element is the parent of another element.
   *
   * isParent(parent, child)
   *
   * @param parent DOM-element
   * @param child DOM-element
   * @returns {boolean}
   */
  function isParent(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  /**
   * Add 1 or more values to an attribute.
   *
   * addAttributeValues(element, attributeName, values)
   *
   * @param element DOM-element
   * @param attributeName string
   * @param values mixed; string or array of strings
   */
  function addAttributeValues(element, attributeName, values) {
    values = Array.isArray(values) ? values : [values];

    var
      attributeVal = element.getAttribute(attributeName),
      currentVals = attributeVal ? attributeVal.split(' ') : [];

    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      if (currentVals.indexOf(value) === -1) {
        currentVals.push(value);
      }
    }
    element.setAttribute(attributeName, currentVals.join(' '));
  }

  /**
   * Remove one or more values from an attribute.
   *
   * removeAttributeValues(element, attributeName, values)
   *
   * @param element DOM-element
   * @param attributeName string
   * @param values mixed; string or array of strings
   */
  function removeAttributeValues(element, attributeName, values) {
    var attributeVal = element.getAttribute(attributeName);
    if (attributeVal) {
      var
        expStart = '((^| )',
        expEnd = '(?= |$))';

      attributeVal = attributeVal.replace(new RegExp(Array.isArray(values) ?
        expStart + values.join(expEnd + '|' + expStart) + expEnd :
        expStart + values + expEnd, 'g'),
        '');

      if (attributeVal) {
        element.setAttribute(attributeName, attributeVal);
      } else {
        element.removeAttribute(attributeName);
      }
    }
  }

  /*
   ---------------
   api
   ---------------
   */

  return {
    getElementById: getElementById,
    getId: getId,
    getAncestors: getAncestors,
    isParent: isParent,
    addAttributeValues: addAttributeValues,
    removeAttributeValues: removeAttributeValues
  };

}));

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('meTools.fn.event', [
      'meTools.fn.variable'
    ], factory);
  } else if(typeof exports === 'object') {
    var fnVariable = require('./variable');
    if (typeof module === 'object') {
      module.exports = factory(fnVariable);
    } else {
      exports['meTools.fn.event'] = factory(fnVariable);
    }
  } else {
    root.meTools = root.meTools || {};
    root.meTools.fn = root.meTools.fn || {};
    root.meTools.fn.event = factory(root.meTools.fn.variable);
  }
}(this, function (fnVariable) {

  /*
   ---------------
   functions
   ---------------
   */

  /**
   * Add an event-listener and register it to an instance.
   * The instance will get a property 'registeredEvents' storing the registered events.
   *
   * registerEvent(scope, target, type, fn [, capture])
   *
   * @param scope object; instance to register the event to
   * @param target DOM object; event target
   * @param type string; event name
   * @param fn function; event handler
   * @param capture boolean; optional; capture the event; default is false
   */
  function registerEvent(scope, target, type, fn, capture) {

    capture = capture || false;

    var
      registeredEvents = scope.registeredEvents = scope.registeredEvents || {},
      typeListeners = registeredEvents[type] = registeredEvents[type] || [],
      targetTypeHandlers = false
      ;

    for (var i in typeListeners) {
      var typeHandlers = typeListeners[i];
      if (typeHandlers.tg === target) {
        targetTypeHandlers = typeHandlers;
        break;
      }
    }

    if (!targetTypeHandlers) {
      targetTypeHandlers = {
        tg: target,
        fns: []
      };
      typeListeners.push(targetTypeHandlers);
    }

    targetTypeHandlers.fns.push([fn, capture]);

    target.addEventListener(type, fn, capture);

  }

  /**
   * Remove (an) event-listener(s), previously registered to an instance.
   *
   * unregisterEvent(scope [, target] [, type] [, fn] [, capture])
   *
   * @param scope object; instance the event was registered to
   * @param target DOM object; optional; event target; if not set, matching events will be removed on all targets
   * @param type string; optional; event name; if not set, all event-types will be removed
   * @param fn function; optional; event handler; if not set, all event-handlers will be removed
   * @param capture boolean; optional; if not set, captured & not-captured events are removed, if true only captured events are removed, if false only not-captured events are removed
   */
  function unregisterEvent(scope, target, type, fn, capture) {
    if (!scope.registeredEvents) {
      return;
    }
    var registeredEvents = scope.registeredEvents;

    if (!type) {
      for (type in registeredEvents) {
        unregisterEvent(scope, target, type, fn, capture);
      }
      return;
    }

    if (!registeredEvents.hasOwnProperty(type)) {
      return;
    }
    var typeListeners = registeredEvents[type];

    if (!target) {
      var cTypeListeners = fnVariable.copyValues(typeListeners);
      while (cTypeListeners.length) {
        var typeListener = cTypeListeners.shift();
        unregisterEvent(scope, typeListener.tg, type, fn, capture);
      }
      return;
    }

    var fns = false,
      typeHandlers;
    for (var j in typeListeners) {
      typeHandlers = typeListeners[j];
      if (typeHandlers.tg === target) {
        fns = typeHandlers.fns;
        break;
      }
    }
    if (!fns) {
      return;
    }

    for (var k = 0; k < fns.length; k++) {
      var fnDef = fns[k];
      if ((typeof(fn) === 'undefined' || !fn || fn === fnDef[0]) &&
        (typeof(capture) === 'undefined' || capture === fnDef[1])) {
        fns.splice(k, 1);
        target.removeEventListener(type, fnDef[0], fnDef[1]);
        k--;
      }
    }

    // remove unused info
    if (!fns.length) {
      typeListeners.splice(j, 1);
    }
    if (!typeListeners.length) {
      delete registeredEvents[type];
    }

  }

  /**
   * Rate-limit the execution of a function (e.g. for events like resize and scroll).
   * Returns a new function, that when called repetitively, executes the original function no more than once every delay milliseconds.
   * (based on https://remysharp.com/2010/07/21/throttling-function-calls)
   *
   * throttle(fn [, threshhold] [, trailing] [, scope])
   *
   * @param fn function; original function to call
   * @param threshhold int; optional; delay (ms) - execute fn no more than once every delay milliseconds; default is 250
   * @param trailing boolean; optional; execute fn after the calls stopped; default is true
   * @param scope object; optional; instance the function should be applied to
   * @returns {Function}
   */
  function throttle(fn, threshhold, trailing, scope) {
    // prepare arguments
    threshhold = threshhold || 250;
    trailing = typeof(trailing) === 'undefined' ? true:trailing;
    scope = scope || this;

    var
      last,
      deferTimer = null;

    return function () {
      var
        now = +new Date(),
        args = arguments;

      if (last && now < last + threshhold) {
        if (trailing) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(scope, args);
          }, threshhold);
        }

      } else {
        last = now;
        clearTimeout(deferTimer);
        fn.apply(scope, args);
      }
    };
  }

  /**
   * Coalesce multiple sequential calls into a single execution at either the beginning or end (e.g. for events like keydown).
   * Returns a new function, that when called repetitively, executes the original function just once per “bunch” of calls.
   *
   * debounce(fn [, pause] [, beginning] [, scope])
   *
   * @param fn function; original function to call
   * @param pause int; optional; min pause (ms) between bunches of calls; default is 250
   * @param beginning boolean; execute at the beginning of the call-bunch; default is false
   * @param scope object; optional; instance the function should be applied to
   * @returns {Function}
   */
  function debounce(fn, pause, beginning, scope) {
    // prepare arguments
    pause = pause || 250;
    scope = scope || this;

    var
      last,
      pauseTimer = null;

    return function () {
      var
        now = +new Date(),
        args = arguments;

      if (!beginning) {
        // defer a possible function call
        clearTimeout(pauseTimer);
        pauseTimer = setTimeout(function () {
          fn.apply(scope, args);
        }, pause);

      } else if (!last || now > last + pause) {
        fn.apply(scope, args);
      }

      last = now;
    };
  }

  /*
   ---------------
   api
   ---------------
   */

  return {
    registerEvent: registerEvent,
    unregisterEvent: unregisterEvent,
    throttle: throttle,
    debounce: debounce
  };

}));

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'meTools.fn.variable',
      'meTools.fn.element',
      'meTools.fn.event'
    ], factory);
  } else if(typeof exports === 'object') {
    var
      fnVariable = require('./fn/variable'),
      fnElement = require('./fn/element'),
      fnEvent = require('./fn/event');
    if (typeof module === 'object') {
      module.exports = factory(fnVariable, fnElement, fnEvent);
    } else {
      exports.meTools = factory(fnVariable, fnElement, fnEvent);
    }
  } else {
    var meTools = root.meTools;
    root.meTools = factory(meTools.fn.variable, meTools.fn.element, meTools.fn.event);
    for (var i in meTools) {
      root.meTools[i] = meTools[i];
    }
  }
}(this, function (fnVariable, fnElement, fnEvent) {
  var api = {};
  for (var i in arguments) {
    for (var j in arguments[i]) {
      api[j] = arguments[i][j];
    }
  }

  return api;

}));

