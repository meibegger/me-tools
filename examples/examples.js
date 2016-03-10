;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['meTools'], factory);
  } else {
    factory(meTools);
  }
} (this, function(meTools) {


  console.log("meTools",meTools);

var
  val = {
    a: "lorem ipsum",
    b: 123,
    c: [1,2,3],
    d: document.getElementById('foo'),
    e: {
      e1: "dolor sit amet",
      e2: 456,
      e3: [4,5,6],
      e4: document.getElementById('foo'),
      e5: {
        e51: 'foo'
      }
    }
  },
  copy = meTools.copyValues(val);

copy.new = 'bar';
console.log("COPIED!", val, copy);

var val2 = {
  a: "Lorem Ipsum",
  t: {
    t1: [7,8,9],
    t2: document.getElementById('foo')
  }
};
console.log("MERGED",val,val2,meTools.mergeObjects(val,val2));

meTools.registerEvent(this,document.getElementById('foo'),'click',function() {alert('HALLO')});

}));