const test = require('tape');

const stringify = require('../index');

const cyclicSrc = {
  a: null,
  b: 1,
  c: 2.3,
  d: 'four',
  e: ['five'],
  f: {
    six: ['seven', 8, 9]
  },
  g: [
    {
      ten: 10,
      eleven: {
        twelve: {
          thirteen: [14, 15]
        }
      }
    }
  ],
  h: {
    i: [
      ['j', 'k', 'l'],
      ['m', 'n', 'o']
    ]
  }
};

const cyclicSrc2 = {
  cycle: cyclicSrc
};
cyclicSrc.p = cyclicSrc2;
cyclicSrc.g[2] = cyclicSrc;

const cyclicSrc3 = {};
cyclicSrc3.tricycle = cyclicSrc3;

cyclicSrc.where = {
  was: {
    that: cyclicSrc3
  }
};

const twice = {
  '2nd': 'time'
};
cyclicSrc.z = twice;
cyclicSrc.h.zz = twice;

test('Cyclic reference should throw error when cycle is not set', (t) => {
  t.throws(() => stringify(cyclicSrc), TypeError);
  t.end();
});

test('Cyclic reference should include "Cyclic Reference" when cycle is `true`', (t) => {
  const expected =
    '{"a":null,"b":1,"c":2.3,"d":"four","e":["five"],"f":{"six":["seven",8,9]},"g":[{"ten":10,"eleven":{"twelve":{"thirteen":[14,15]}}},null,{"__type":"Cyclic Reference","__path":""}],"h":{"i":[["j","k","l"],["m","n","o"]],"zz":{"2nd":"time"}},"p":{"cycle":{"__type":"Cyclic Reference","__path":""}},"where":{"was":{"that":{"tricycle":{"__type":"Cyclic Reference","__path":"where.was.that"}}}},"z":{"__type":"Cyclic Reference","__path":"h.zz"}}';
  const actual = stringify(cyclicSrc, {
    cycle: true
  });

  t.equal(actual, expected);
  t.end();
});

test('Cyclic reference should call cycle when it is a function', (t) => {
  const expected =
    '{"a":null,"b":1,"c":2.3,"d":"four","e":["five"],"f":{"six":["seven",8,9]},"g":[{"ten":10,"eleven":{"twelve":{"thirteen":[14,15]}}},null,{"cycle":true,"type":"Object","key":"2","path":""}],"h":{"i":[["j","k","l"],["m","n","o"]],"zz":{"2nd":"time"}},"p":{"cycle":{"cycle":true,"type":"Object","key":"cycle","path":""}},"where":{"was":{"that":{"tricycle":{"cycle":true,"type":"Object","key":"tricycle","path":"where.was.that"}}}},"z":{"cycle":true,"type":"Object","key":"z","path":"h.zz"}}';
  const actual = stringify(cyclicSrc, {
    cycle: (cInfo, k, v) => {
      return {
        cycle: true,
        type: Array.isArray(v)
          ? 'Array'
          : (((v && v.prototype) || {}).constructor || {}).name || typeof v,
        key: k,
        path: cInfo.path
      };
    }
  });

  t.equal(actual, expected);
  t.end();
});
