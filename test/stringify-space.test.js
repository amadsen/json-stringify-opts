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

test('Should return the full JSON string when using defaults', (t) => {
  const expected = JSON.stringify(depthSrc);
  const actual = stringify(depthSrc);

  t.equal(actual, expected);
  t.end();
});

test('Should return the full JSON string with proper spacing when space is 2', (t) => {
  const expected = JSON.stringify(depthSrc, null, 2);
  const actual = stringify(depthSrc, {
    space: 2
  });

  t.equal(actual, expected);
  t.end();
});

test('Should return the full JSON string with proper spacing when space is " "', (t) => {
  const expected = JSON.stringify(depthSrc, null, ' ');
  const actual = stringify(depthSrc, {
    space: ' '
  });

  t.equal(actual, expected);
  t.end();
});

// TODO: implement and test spacer function
