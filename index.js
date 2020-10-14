const stringify = function (src, opts) {
  // Set default options
  const o = {};
  opts = opts || {};
  o.space = opts.space || null;
  o.replacer = opts.replacer || null;

  o.cycle =
    opts.cycle === true || 'function' == typeof opts.cycle ? true : false;
  const cycleFn =
    'function' == typeof opts.cycle ? opts.cycle : doubleunderscoreProps;

  o.unsupported =
    opts.unsupported === true || 'function' == typeof opts.unsupported
      ? true
      : false;
  const unsupportedFn =
    'function' == typeof opts.unsupported
      ? opts.unsupported
      : doubleunderscoreProps;

  // Depth defaults are a bit more tricky to set
  let maxDepth = opts.maxDepth || opts.depth;
  o.maxDepth = maxDepth > -1 ? maxDepth : -1;
  if (o.maxDepth < 0 && typeof opts.depth == 'function') {
    o.maxDepth = 0;
  }

  const depthFn =
    'function' == typeof opts.depth ? opts.depth : doubleunderscoreProps;

  const graph = [];
  const json = JSON.stringify(
    src,
    function (k, v) {
      const parent = this;
      const pIdx = findInGraph(graph, parent);
      // NOTE: On the very first call we have an empty string key
      // and the whole object that we are stringifying. That's
      // depth -1 because we are actually "in" an object that the
      // user did not pass in.
      const pNode = pIdx > -1 ? graph[pIdx] : { depth: -1 };
      const d = (pNode.depth || 0) + 1;

      const vType = typeof v;

      // 'object' will capture both Objects and Arrays
      if ('object' === vType && v) {
        const vIdx = findInGraph(graph, v);
        if (vIdx > -1) {
          // This is a cycle!
          if (o.cycle) {
            // We _don't_ pass the cycle replacement to our normal replacer function.
            return cycleFn(
              {
                type: 'Cyclic Reference',
                path: pathFromGraph(graph, graph[vIdx])
              },
              k,
              v
            );
          }
          // Just expect JSON.stringify to handle or error it
          // so the user's replacer can have a chance at it.
        }

        graph.push({
          key: k,
          obj: v,
          parent: parent,
          depth: d
        });
      }

      if (
        o.unsupported &&
        (('number' === vType && !isFinite(v)) ||
          (!(v && 'function' === typeof v.toJSON) &&
            !/(object|number|string|boolean)/.test(vType)))
      ) {
        // Detect and handle unsupported value types - object here means `null`
        // We _don't_ pass the unsupported replacement to our normal replacer function.
        return unsupportedFn(
          {
            type: typeString(v),
            path: pathFromGraph(graph, graph[pIdx]) + pathSegment(k, parent)
          },
          k,
          v
        );
      }

      // Check our depth!
      if (o.maxDepth > -1 && d > o.maxDepth) {
        // We _don't_ pass the depth replacement to our normal replacer function.
        // NOTE: Passing the depth here allows the user to implment their own depth
        // handling logic.
        return depthFn(
          {
            type: typeString(v),
            path: pathFromGraph(graph, graph[pIdx]) + pathSegment(k, parent),
            depth: d
          },
          k,
          v
        );
      }

      if ('function' == typeof opts.replacer) {
        const r = opts.replacer.bind(parent);
        return r(k, v);
      }

      return v;
    },
    o.space
  );

  // console.log(graph);
  return json;
};

const findInGraph = (graph, toFind) => {
  return graph.reduce((found, node, idx) => {
    // If we've already found our index, just return it.
    // Otherwise, check if toFind is the object in the graph.
    return found > 0 || node.obj !== toFind ? found : idx;
  }, -1);
};

const pathFromGraph = (graph, node) => {
  if (!node || node.key === undefined) {
    return '';
  }

  if (node.depth > 1) {
    const pIdx = findInGraph(graph, node.parent);
    const pNode = pIdx > -1 ? graph[pIdx] : null;

    if (pNode) {
      return pathFromGraph(graph, pNode) + pathSegment(node.key, node.parent);
    }
  }

  return node.key;
};

const pathSegment = (key, parent) => {
  k = key || '""';
  return Array.isArray(parent) ? '[' + k + ']' : '.' + k;
};

const typeString = (v) => {
  const vType = typeof v;
  if (Array.isArray(v)) {
    return 'Array';
  }

  if ('number' === vType) {
    if (Number.isNaN(v)) {
      return 'NaN';
    }

    if (v > 0 && !isFinite(v)) {
      return 'Infinity';
    }

    if (v < 0 && !isFinite(v)) {
      return '-Infinity';
    }
  }

  if ('object' != vType) {
    return vType;
  }

  if ('object' === vType && !v) {
    return 'null';
  }

  return ((v.prototype || {}).constructor || {}).name || vType;
};

const doubleunderscoreProps = (info, k, v) => {
  if (/(null|number|string|boolean)/.test(info.type)) {
    return v;
  }

  return Object.keys(info).reduce((out, k) => {
    out['__' + k] = info[k];
    return out;
  }, {});
};

module.exports = stringify;
