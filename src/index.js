
define(['./fn/variable','./fn/element','./fn/event'], function (variable,element,event) {

  var api = {};
  for (var i in arguments) {
    for (var j in arguments[i]) {
      api[j] = arguments[i][j];
    }
  }

  return api;

});