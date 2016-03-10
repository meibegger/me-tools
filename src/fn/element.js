define(function () {

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
   * getAncestors(element [, selector] [, container] [, single])
   *
   * @param element DOM-Element;
   * @param selector String; optional; selector to match the parents against
   * @param container DOM-Element; optional; max parent to check; default is body
   * @param single Boolean; optional; return only the next matching ancestor
   * @return array
   */
  function getAncestors(element, selector, container, single) {
    // prepare arguments
    var
      argSelector = false,
      argContainer = false,
      argSingle = false;
    for (var i = 0; i < arguments.length; i++) {
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
        var parent = element.parentElement();
        if (!selector || parent.matchesSelector(selector)) {
          if (single) {
            return parent;
          } else {
            parents.push(parent);
          }
        }
        if (parent === container) {
          return single ? false : parents;
        }
        getAncestors(parent);
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

  /*
   ---------------
   api
   ---------------
   */

  return {
    getElementById: getElementById,
    getId: getId,
    getAncestors: getAncestors,
    isParent: isParent
  };
});
