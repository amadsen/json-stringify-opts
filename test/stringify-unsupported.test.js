const test = require('tape');

const stringify = require('../index');

const Example = function () {
  this.isExample = true;
};
Example.prototype = {};
Example.prototype.constructor = Example;

// undefined, function, Symbol, BigInt, Infinity, NaN, symbol-keyed properties
const unsupportedSrc = {
  a: Symbol('a'),
  b: undefined,
  c: () => {},
  d: Number('jhsfkg'),
  e: 1 / 0,
  f: -1 / 0,
  g: 12345678900987654321001122334455667n
};

const ignoredSrc = {
  a: Symbol('a'),
  b: undefined,
  c: () => {},
  d: Number('jhsfkg'),
  e: 1 / 0,
  f: -1 / 0
};

test('BigInt should throw error when unsupported is not set', (t) => {
  t.throws(() => stringify(unsupportedSrc), TypeError);
  t.end();
});

test('Object with ignored values should return the JSON string for an empty object when unsupported is not set', (t) => {
  const expected = '{"d":null,"e":null,"f":null}';
  const actual = stringify(ignoredSrc);

  t.equal(actual, expected);
  t.end();
});

test('JSON string should report unsupported values when unsupported is `true`', (t) => {
  const expected = JSON.stringify(
    {
      a: {
        __type: 'symbol',
        __path: '.a'
      },
      b: {
        __type: 'undefined',
        __path: '.b'
      },
      c: {
        __type: 'function',
        __path: '.c'
      },
      d: {
        __type: 'NaN',
        __path: '.d'
      },
      e: {
        __type: 'Infinity',
        __path: '.e'
      },
      f: {
        __type: '-Infinity',
        __path: '.f'
      },
      g: {
        __type: 'bigint',
        __path: '.g'
      }
    },
    null,
    1
  );
  const actual = stringify(unsupportedSrc, {
    space: 1,
    unsupported: true
  });

  t.equal(actual, expected);
  t.end();
});

test('Should call unsupported when unsupported is a function', (t) => {
  const expected = JSON.stringify(
    {
      a: {
        type: 'symbol',
        path: '.a'
      },
      b: {
        type: 'undefined',
        path: '.b'
      },
      c: {
        type: 'function',
        path: '.c'
      },
      d: {
        type: 'NaN',
        path: '.d'
      },
      e: {
        type: 'Infinity',
        path: '.e'
      },
      f: {
        type: '-Infinity',
        path: '.f'
      },
      g: {
        type: 'bigint',
        path: '.g'
      }
    },
    null,
    1
  );
  const actual = stringify(unsupportedSrc, {
    space: 1,
    unsupported: (info, k, v) => {
      return info;
    }
  });

  t.equal(actual, expected);
  t.end();
});
