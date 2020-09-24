/**
 * @fileoverview Prevent usage of setState in lifecycle methods
 * @author Yannick Croissant
 */

'use strict';

const docsUrl = require('./docsUrl');
const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function mapTitle(methodName) {
  const map = {
    componentDidMount: 'did-mount',
    componentDidUpdate: 'did-update',
    componentWillUpdate: 'will-update',
    componentWillUnmount: 'will-unmount'
  };
  const title = map[methodName];
  if (!title) {
    throw Error(`No docsUrl for '${methodName}'`);
  }
  return `no-${title}-set-state`;
}

function makeNoMethodSetStateRule(methodName, shouldCheckUnsafeCb) {
  return {
    meta: {
      docs: {
        description: `Prevent usage of setState in ${methodName}`,
        category: 'Best Practices',
        recommended: false,
        // url: docsUrl(mapTitle(methodName))
      },

      schema: [{
        enum: ['disallow-in-func']
      }]
    },

    create: Components.detect((context, components, utils) => {
      const mode = context.options[0] || 'allow-in-func';
      let subCounts = 0;
      let unsubCount = 0;

      let hasComponentDidMount = false
      let hasComponentWillUnmount = false

      function nameMatches(name) {

        if (['componentDidMount', 'componentWillUnmount'].indexOf(name) > -1) {
          return true;
        }

        if (typeof shouldCheckUnsafeCb === 'function' && shouldCheckUnsafeCb(context)) {
          return name === `UNSAFE_${methodName}`;
        }

        return false;
      }

      function isComponentDidMount(name) {
        return name === 'componentDidMount'
      }

      function isComponentWillUnmount(name) {
        return name === 'componentWillUnmount'
      }

      // --------------------------------------------------------------------------
      // Public
      // --------------------------------------------------------------------------

      return {
        CallExpression(node) {
          const callee = node.callee;
          if (
            callee.type !== 'MemberExpression'
            || callee.object.type !== 'ThisExpression'
            || (callee.property.name !== 'setState' && callee.property.name !== 'unsetState')
          ) {
            return;
          }
          const ancestors = context.getAncestors(callee).reverse();

          let depth = 0;

          ancestors.some((ancestor) => {
            if (/Function(Expression|Declaration)$/.test(ancestor.type)) {
              depth++;
            }
            if (
              (ancestor.type !== 'Property' && ancestor.type !== 'MethodDefinition' && ancestor.type !== 'ClassProperty')
              || !nameMatches(ancestor.key.name)
              || (mode !== 'disallow-in-func' && depth > 1)
            ) {
              return false;
            }
            if (isComponentDidMount(ancestor.key.name)) {
              hasComponentDidMount = true
              subCounts++
            }
            if (isComponentWillUnmount(ancestor.key.name)) {
              hasComponentWillUnmount = true;
              unsubCount++
            }
            
            if (hasComponentWillUnmount && hasComponentDidMount) return false;

            context.report({
              node: callee,
              message: `Do not use setState in ${ancestor.key.name}`
            });
            return true;
          });
        },
        'Program:exit'() {
          
          console.log(subCounts,unsubCount)
        }
      };
    })
  };
}

module.exports = makeNoMethodSetStateRule;
