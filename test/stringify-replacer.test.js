const test = require('tape');

const stringify = require('../index');

const depthSrc = {
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

test('Should return the normal JSON string when a replacer function is used.', (t) => {
  const replacer = (k, v) => {
    if (/(number|string|boolean)/.test(typeof v)) {
      return undefined;
    }
    return v;
  };
  const expected = JSON.stringify(depthSrc, replacer);
  const actual = stringify(depthSrc, {
    replacer: replacer
  });

  t.equal(actual, expected);
  t.end();
});

// TODO: should call replacer function
// TODO: cycles should not call replacer function
// TODO: unsupported should not call replacer function
// TODO: depth should not call replace function
