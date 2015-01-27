var existential = require('./existential');
var warn = require('./warn');
var policy = require('./policy');
var handlers = require('./handlers');
var MIXINS_KEY = 'mixins';
/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys ( one, two ) {
    if (existential.isObject(one) && existential.isObject(two)) {
        warn('cannot merge non-objects');
    }

    for (var key in two) {
        if (two.hasOwnProperty(key)) {
            if (one.hasOwnProperty(key)) {
                warn('Tried to merge two objects with the same key (' + key + ')');
            }
            one[key] = two[key];
        }
    }
    return one;
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction ( one, two ) {
    return function chainedFunction () {
        one.apply(this, arguments);
        two.apply(this, arguments);
    };
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction ( one, two ) {
    return function mergedResult () {
        var a = one.apply(this, arguments);
        var b = two.apply(this, arguments);
        if (a == null) {
            return b;
        } else if (b == null) {
            return a;
        }
        var c = {};
        mergeIntoWithNoDuplicateKeys(c, a);
        mergeIntoWithNoDuplicateKeys(c, b);
        return c;
    };
}

function validateTypeDef ( Constructor, typeDef, location ) {
    for (var propName in typeDef) {
        if (typeDef.hasOwnProperty(propName)) {
            if (!existential.isFunction(typeDef[propName])) {
                warn((Constructor.displayName || 'Class') + " was expecting a function for '" + propName + "'");
            }
        }
    }
}

function validateMethodOverride ( /* this has changed */ baseInterface, proto, name ) {
    var specPolicy = baseInterface.hasOwnProperty(name) ? baseInterface[name] : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (baseInterface.hasOwnProperty(name)) {
        if (specPolicy === policy.OVERRIDE_BASE) {
            warn("You are attempting to override '" + name + "' from your class specification.");
        }
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (proto.hasOwnProperty(name)) {
        if (specPolicy === policy.DEFINE_MANY ||
            specPolicy === policy.DEFINE_MANY_MERGED) {
            warn("You are attempting to override '" + name + "' more than once. This may be due to a mixin.");
        }
    }
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classses.
 */
function mixSpecIntoComponent(Constructor, spec, classPolicy) {
    if (!spec) {
        return;
    }

    if (!existential.isFunction(spec)) {
        warn('A function is being passed in as a mixin. Expecting an object');
    }

    var proto = Constructor.prototype;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty('mixins')) {
        handlers.MIXINS(Constructor, 'mixins', spec['mixins'], classPolicy);
    }

    for (var name in spec) {
        if (!spec.hasOwnProperty(name)) {
            continue;
        }

        if (name === MIXINS_KEY) {
            // We have already handled mixins in a special case above
            continue;
        }

        var property = spec[name];
        var policyName = classPolicy[name];

        validateMethodOverride(proto, name);

        if (policyName && handlers.hasOwnProperty(policyName)) {
            // since there is a handler defined, we need to mixin according
            // to the policy.
            handlers[policyName](Constructor, name, property, classPolicy);
        } else {
            // Setup methods on prototype
            var isAlreadyDefined = proto.hasOwnProperty(name);
            var isFunction = existential.isFunction(property);
            var shouldAutoBind =
                isFunction &&
                !policyName &&
                !isAlreadyDefined;

            if (shouldAutoBind) {
                if (!proto.__autoBind) {
                    proto.__autoBind = {};
                }
                proto.__autoBind[name] = property;
                proto[name] = property;
            } else if (isAlreadyDefined) {
                var specPolicy = ReactClassInterface[name];

                // For methods which are defined more than once, call the existing
                // methods before calling the new property, merging if appropriate.
                if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
                    proto[name] = createMergedResultFunction(proto[name], property);
                } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
                    proto[name] = createChainedFunction(proto[name], property);
                }
            } else {
                proto[name] = property;

                // Add verbose displayName to the function, which helps when looking
                // at profiling tools.
                //if (isFunction && spec.displayName) {
                //    proto[name].displayName = spec.displayName + '_' + name;
                //}
            }
        }
    }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
        return;
    }
    for (var name in statics) {
        if (statics.hasOwnProperty(name)) {
            var property = statics[name];
            Constructor[name] = property;
        }
    }
}


module.exports = {
    mergeIntoWithNoDuplicateKeys: mergeIntoWithNoDuplicateKeys,
    createChainedFunction: createChainedFunction,
    createMergedResultFunction: createMergedResultFunction,
    mixStaticSpecIntoComponent: mixStaticSpecIntoComponent,
    mixSpecIntoComponent: mixSpecIntoComponent,
    validateTypeDef: validateTypeDef,
    validateMethodOverride: validateMethodOverride
};