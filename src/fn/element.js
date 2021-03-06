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
   * removeAttributeValues(element, attributeName, values, keepEmptyAttribute)
   *
   * @param element DOM-element
   * @param attributeName string
   * @param values mixed; string or array of strings
   * @param keepEmptyAttribute bool
   */
  function removeAttributeValues(element, attributeName, values, keepEmptyAttribute) {
    var attributeVal = element.getAttribute(attributeName);
    if (attributeVal) {
      var
        expStart = '((^| )',
        expEnd = '(?= |$))';

      attributeVal = attributeVal.replace(new RegExp(Array.isArray(values) ?
        expStart + values.join(expEnd + '|' + expStart) + expEnd :
        expStart + values + expEnd, 'g'),
        '');

      if (keepEmptyAttribute || attributeVal) {
        element.setAttribute(attributeName, attributeVal);
      } else {
        element.removeAttribute(attributeName);
      }
    }
  }

  /**
   * Checks if an attribute has a value (word).
   *
   * hasAttributeValue(element, attributeName, value)
   *
   * @param element DOM-element
   * @param attributeName string
   * @param value string
   * @returns {boolean}
   */
  function hasAttributeValue(element, attributeName, value) {
    var attributeVal = element.getAttribute(attributeName);
    if (attributeVal) {
      var
        expStart = '((^| )',
        expEnd = '(?= |$))';

      return !!attributeVal.match(new RegExp(expStart + value + expEnd, 'g'));
    }
    return false;
  }

  /**
   * Get all radio-buttons belonging to a radio-button's group
   * @param radio DOM-Element radio element
   * @returns []
   */
  function getRadioGroup(radio) {
    // get the form for the radiobutton
    var
      form = getAncestors(radio, 'form', true) || // radiobutton is contained in a form
        document,
      name = radio.getAttribute('name');

    return [].slice.call(form.querySelectorAll('input[type="radio"][name="' + name + '"]'));
  }


  /**
   * Returns all focusable elements, ordered by tabindex
   * @param container DOM-Element; required
   * @param selector String selector for elements which are focusable; optionsl; default is 'a,frame,iframe,input:not([type=hidden]),select,textarea,button,*[tabindex]'
   * @returns {Array}
   */
  function fetchFocusables (container, selector) {
    selector = selector || 'a,frame,iframe,input:not([type=hidden]),select,textarea,button,*[tabindex]:not([tabindex="-1"])';
    return orderByTabindex(container.querySelectorAll(selector));

  }

  /**
   * @param focusables Array of Dom-Elements
   * @returns {Array}
   */
  function orderByTabindex (focusables) {
    var
      byTabindex = [],
      ordered = [];

    for (var i = 0; i < focusables.length; i++) {
      var
        focusable = focusables[i],
        tabindex = Math.max(0, focusable.getAttribute('tabindex') || 0);

      byTabindex[tabindex] = byTabindex[tabindex] || [];
      byTabindex[tabindex].push(focusable);
    }

    for (var j in byTabindex) {
      for (var k in byTabindex[j]) {
        ordered.push(byTabindex[j][k]);
      }
    }

    return ordered;
  }

  /**
   * Return not disabled, visible, tabable-radio ordered by the specified tab-direction
   * @param focusables Array of DOM-Elements; required
   * @param tabDirection int; optional; tab-direction (-1 or 1); default is 1
   * @returns {Array} or false
   */
  function getFocusables (focusables, tabDirection) {
    // prepare argument
    tabDirection = typeof(tabDirection) === 'undefined' ? 1 : tabDirection;

    var
      filtered = [],
      doneRadios = []; // already processed radio-buttons

    function evalCandidate(candidate) {
      if (candidate.matches(':not([disabled])') && (candidate.offsetWidth || candidate.offsetHeight)) { // not disabled & visible
        if (candidate.matches('input[type="radio"]')) { // remove all radio buttons which are not tabable
          if (doneRadios.indexOf(candidate) === -1) { // group of this radio not processed yet
            // get radio-group
            var
              radioGroup = getRadioGroup(candidate),
              focusableRadio = null;

            doneRadios = doneRadios.concat(radioGroup);

            // get tabable radios of the group (checked or first&last of group)
            for (var j = 0; j < radioGroup.length; j++) {
              var radio = radioGroup[j];
              if (radio.checked) {
                focusableRadio = radio;
                break;
              }
            }
            if (!focusableRadio) {
              focusableRadio = tabDirection === -1 ? radioGroup[radioGroup.length-1] : radioGroup[0]; // default is tabable in tab-direction!!!
            }
            return focusableRadio;
          }

        } else {
          return candidate;
        }

        return false;
      }
    }

    // remove all elements which are not tabable
    if (tabDirection === 1) {
      for (var i = 0; i < focusables.length; i++) {
        var tabable = evalCandidate(focusables[i]);
        if (tabable) {
          filtered.push(tabable);
        }
      }
    } else {
      for (var j = focusables.length-1; j >= 0; j--) {
        var backwardTabable = evalCandidate(focusables[j]);
        if (backwardTabable) {
          filtered.push(backwardTabable);
        }
      }
    }

    return filtered;
  }

  /**
   *
   * @param container DOM-Element
   * @param fn(container, focusables) Function returning the element to focus
   */
  function focusInside(container, fn) {
    var
      toFocus = null,
      focusables = getFocusables(fetchFocusables(container));

    if (typeof fn === 'function') {
      toFocus = fn(container, focusables);
    }
    if (!toFocus && focusables.length) {
      toFocus = focusables[0];
    }
    if (!toFocus) {
      var containerTabindex = container.getAttribute('tabindex');
      if (!containerTabindex) {
        container.setAttribute('tabindex', '-1');
      }
      toFocus = container;
    }

    toFocus.focus();
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
    removeAttributeValues: removeAttributeValues,
    hasAttributeValue: hasAttributeValue,
    fetchFocusables: fetchFocusables,
    orderByTabindex: orderByTabindex,
    getFocusables: getFocusables,
    focusInside: focusInside
  };

}));
