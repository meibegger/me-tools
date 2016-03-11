define(['./variable'],function (variable) {

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
      var cTypeListeners = variable.copyValues(typeListeners);
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
});
