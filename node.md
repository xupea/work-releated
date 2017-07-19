The module wrapper

Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:

> (function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
