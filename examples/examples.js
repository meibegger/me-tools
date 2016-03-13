;
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['meTools'], factory);
  } else {
    factory(meTools);
  }
}(this, function (meTools) {

  // copyValues
  var
    val = {
      a: "lorem ipsum",
      b: 123,
      c: [1, 2, 3],
      d: document.getElementById('headline'),
      e: {
        e1: "dolor sit amet",
        e2: 456,
        e3: [4, 5, 6],
        e4: document.getElementById('headline'),
        e5: {
          e51: 'foo'
        }
      }
    },
    copy = meTools.copyValues(val);
  console.log("--- COPIED");
  console.log("original value", val);
  console.log("copy", copy);

  // manipulate copy
  var newElement = "NEW",
  manipulate = function (obj) {
    if (Array.isArray(obj)) {
      for (var i in obj) {
        manipulate(obj[i]);
      }
      obj.push(newElement);

    } else if (obj && typeof(obj) === 'object' && typeof(obj.tagName) === 'undefined') {
      for (var key in obj) {
        manipulate(obj[key]);
      }
      obj.new = newElement;
    }
  };
  manipulate(copy);
  console.log("--- MANIPULATED COPY");
  console.log("original value", val);
  console.log("copy", copy);

  // mergeObjects
  var val2 = {
    a: "Lorem Ipsum",
    t: {
      t1: [7, 8, 9],
      t2: document.getElementById('headline')
    }
  };
  console.log("-- MERGED");
  console.log("val 1",val);
  console.log("val 2",val2);
  console.log("merged",meTools.mergeObjects(val, val2));

  // isEmptyObject
  console.log("--- IS EMPTY");
  console.log(val,meTools.isEmptyObject(val));
  console.log({},meTools.isEmptyObject({}));

  // (un)registerEvent
  var scope = {},
    target1 = document.getElementById('target1'),
    target2 = document.getElementById('target2'),
    mouseDown = function () {
      console.log("MOUSE DOWN");
    },
    mouseDown1 = function () {
      console.log("MOUSE DOWN ON TARGET 1");
    },
    mouseDown2 = function () {
      console.log("MOUSE DOWN ON TARGET 2");
    },
    mouseUp = function () {
      console.log("MOUSE UP");
    };
  document.getElementById('registerEvents').addEventListener('click',function () {
    meTools.unregisterEvent(scope); // reset
    meTools.registerEvent(scope,target1,'mousedown',mouseDown);
    meTools.registerEvent(scope,target1,'mousedown',mouseDown1);
    meTools.registerEvent(scope,target1,'mouseup',mouseUp);
    meTools.registerEvent(scope,target2,'mousedown',mouseDown);
    meTools.registerEvent(scope,target2,'mousedown',mouseDown2);
    meTools.registerEvent(scope,target2,'mouseup',mouseUp);
  });
  document.getElementById('unregisterAll').addEventListener('click',function () {
    meTools.unregisterEvent(scope);
  });
  document.getElementById('unregisterTarget1').addEventListener('click',function () {
    meTools.unregisterEvent(scope,target1);
  });
  document.getElementById('unregisterSpecific1').addEventListener('click',function () {
    meTools.unregisterEvent(scope,null,null,mouseDown1);
  });
  document.getElementById('unregisterGeneral').addEventListener('click',function () {
    meTools.unregisterEvent(scope,null,null,mouseDown);
  });
  document.getElementById('unregisterGeneral1').addEventListener('click',function () {
    meTools.unregisterEvent(scope,target1,null,mouseDown);
  });
  document.getElementById('unregisterMouseDown').addEventListener('click',function () {
    meTools.unregisterEvent(scope,null,'mousedown');
  });

  // throttle
  window.addEventListener('mousemove',meTools.throttle(function() {
    console.log("THROTTLED MOUSE MOVE")
  }));

  // debounce
  window.addEventListener('mousemove',meTools.debounce(function() {
    console.log("START MOUSE MOVE")
  },0,true));
  window.addEventListener('mousemove',meTools.debounce(function() {
    console.log("END MOUSE MOVE")
  }));

  // addAttributeValues
  var element = document.getElementById('attributeElement');
  document.getElementById('addAttributeValue').addEventListener('click',function () {
    meTools.addAttributeValues(element,'data-some-attribute','SOME-VAL1');
  });
  document.getElementById('addAttributeValues').addEventListener('click',function () {
    meTools.addAttributeValues(element,'data-some-attribute',['SOME-VAL2','SOME-VAL3']);
  });
  document.getElementById('removeAttributeValue').addEventListener('click',function () {
    meTools.removeAttributeValues(element,'data-some-attribute','SOME-VAL1');
  });
  document.getElementById('removeAttributeValues').addEventListener('click',function () {
    meTools.removeAttributeValues(element,'data-some-attribute',['SOME-VAL2','SOME-VAL3']);
  });


}));