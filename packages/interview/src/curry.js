function curry(fn) {
  return function curried(...args) {
    if (args.length === fn.length) {
      return fn.apply(this, args);
    }

    // return curried.bind(this, args);
    return function (...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

function addA(a) {
  return function addB(b) {
    return function addC(c) {
      return a + b + c;
    };
  };
}

const a = addA(5);
const ab = a(10);
const abc = ab(100);
