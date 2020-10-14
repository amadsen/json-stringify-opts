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

test('Should return the full JSON string when depth is not set', (t) => {
  const expected = JSON.stringify(depthSrc, null, 2);
  const actual = stringify(depthSrc, {
    space: 2
  });

  t.equal(actual, expected);
  t.end();
});

test('Should redact objects deeper than 1 levels when depth is 1', (t) => {
  const expected = JSON.stringify(
    {
      a: null,
      b: 1,
      c: 2.3,
      d: 'four',
      e: ['five'],
      f: {
        six: {
          __type: 'Array',
          __path: 'f.six',
          __depth: 2
        }
      },
      g: [
        {
          __type: 'Object',
          __path: 'g[0]',
          __depth: 2
        }
      ],
      h: {
        i: {
          __type: 'Array',
          __path: 'h.i',
          __depth: 2
        }
      }
    },
    null,
    1
  );

  const actual = stringify(depthSrc, {
    space: 1,
    depth: 1
  });

  t.equal(actual, expected);
  t.end();
});

test('Should redact objects deeper than 2 levels when depth is 2', (t) => {
  const expected = JSON.stringify(
    {
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
            __type: 'Object',
            __path: 'g[0].eleven',
            __depth: 3
          }
        }
      ],
      h: {
        i: [
          {
            __type: 'Array',
            __path: 'h.i[0]',
            __depth: 3
          },
          {
            __type: 'Array',
            __path: 'h.i[1]',
            __depth: 3
          }
        ]
      }
    },
    null,
    1
  );

  const actual = stringify(depthSrc, {
    space: 1,
    depth: 2
  });

  t.equal(actual, expected);
  t.end();
});

// TODO: test depth function!!!!!!!!!
test('Should allow replacing objects based on depth when depth is a function', (t) => {
  const expected = JSON.stringify(
    {
      a: null,
      b: 1,
      c: 2.3,
      d: 'four',
      e: ['five'],
      f: {
        six: ['seven', null, null]
      },
      g: [
        {
          eleven: {
            twelve: {
              thirteen: [null, null]
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
    },
    null,
    1
  );

  const actual = stringify(depthSrc, {
    space: 1,
    depth: (info, k, v) => {
      if (info.depth > 1 && /number/i.test(info.type)) {
        return undefined;
      }

      return v;
    }
  });

  t.equal(actual, expected);
  t.end();
});
