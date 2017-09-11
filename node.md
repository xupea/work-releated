https://schroders.invisionapp.com/boards/7634SQYTVJX2E#/5262730/159654153The module wrapper

Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:

> (function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
