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

