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
