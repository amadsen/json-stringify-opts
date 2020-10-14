# JSON Stringify Options

`JSON.stringify()` works very nicely for many things, but occasionally you want to handle something it does not support - or handle it differently. `json-stringify-opts` provides options for specifying:

1. *depth* `Number | Function` - the depth at which values should be replaced by information about the value. When used as a function, it takes the form `(depthInfo, k, v) => replacement`. *maxDepth* can also be used to set the depth and is most useful when you want to set both a depth replacer function and the depth at which
2. *cycle* `Boolean | Function` - detect cycles and replace them with information about the cyclic reference. When used as a function, it takes the form `(cycleInfo, k, v) => replacement`.
3. *unsupported* `Boolean | Function` - detect unsupported values and replace them with information about the value. When used as a function, it takes the form `(unsupportedInfo, k, v) => replacement`.
4. *replacer* - passthrough to `json.stringify()`'s `replacer` parameter.
5. *space* - passthrough to `json.stringify()`'s `space` parameter.

## TODO

+ add a *toJSON* option that detects when a value's toJSON() method is about to be called and wraps the result in an object that also contains a type descriptor to facilitate restoring the actual type when parsing.
+ actually document how and why you'd want to use this module (it's not for every scenario!)
