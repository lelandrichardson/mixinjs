var existential = require('./existential');
var warn = require('./warn');
var policy = require('./policy');
var handlers = require('./handlers');
var assign = require('object-assign');
var MIXINS_KEY = 'mixins';

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys ( one, two ) {
    if (!existential.isObject(one) || !existential.isObject(two)) {
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

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classses.
 */
function mixSpecIntoComponent ( Constructor, spec, classPolicy ) {
    if (!spec) {
        return;
    }

    if (existential.isFunction(spec)) {
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
            // We have already handled mixins in the special case above
            continue;
        }

        var property = spec[name];
        var policyName = classPolicy[name];

        //validateMethodOverride(proto, name);

        if (policyName && handlers.hasOwnProperty(policyName)) {

            if (!handlers.hasOwnProperty(policyName)) {
                warn("no handler defined for policy '" + policyName + "'");
            } else {
                // since there is a handler defined, we need to mixin according
                // to the policy.
                handlers[policyName](Constructor, name, property, classPolicy);
            }
        } else {
            // Setup methods on prototype
            var isAlreadyDefined = proto.hasOwnProperty(name);
            var isFunction = existential.isFunction(property);
            var shouldAutoBind =
                isFunction && !policyName && !isAlreadyDefined;

            if (shouldAutoBind) {
                if (!proto.__autoBind) {
                    proto.__autoBind = {};
                }
                proto.__autoBind[name] = property;
            }

            proto[name] = property;
        }
    }
}

function mixStaticSpecIntoComponent ( Constructor, statics ) {
    if (!statics) {
        return;
    }
    for (var name in statics) {
        if (statics.hasOwnProperty(name)) {
            Constructor[name] = statics[name];
        }
    }
}

function add ( constant, handler ) {
    handlers[constant] = handler;
}

add("CONSTRUCTOR_DISPLAY_NAME", function ( Constructor, propName, prop ) {
    Constructor.displayName = prop;
});

add("MIXINS", function ( Constructor, propName, prop, classPolicy ) {
    if (prop) {
        for (var i = 0; i < prop.length; i++) {
            mixSpecIntoComponent(Constructor, prop[i], classPolicy);
        }
    }
});

add("STATICS", function ( Constructor, key, value ) {
    mixStaticSpecIntoComponent(Constructor, value);
});

add(policy.method.REQUIRED_ONCE, function ( Constructor, key, value ) {
    if (Constructor.prototype[key]) {
        throw new Error("policy does not allow '" + key + "' to be defined more than once");
    } else {
        Constructor.prototype[key] = value;
    }
});

add(policy.method.MERGE_RESULT, function ( Constructor, methodName, method ) {
    if (Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = createMergedResultFunction(
            Constructor.prototype[methodName],
            method
        );
    } else {
        Constructor.prototype[methodName] = method;
    }
});

add(policy.method.OVERRIDABLE, function ( Constructor, methodName, method ) {
    Constructor.prototype[methodName] = method;
});

add(policy.method.DEFINE_MANY, function ( Constructor, methodName, method ) {
    if (Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = createChainedFunction(
            Constructor.prototype[methodName],
            method
        );
    } else {
        Constructor.prototype[methodName] = method;
    }
});

add(policy.object.MERGE, function ( Constructor, propName, prop ) {
    Constructor.prototype[propName] = assign({}, Constructor.prototype[propName], prop);
});

add(policy.object.OVERRIDABLE, function ( Constructor, propName, prop ) {
    Constructor.prototype[propName] = prop;
});

add(policy.object.REQUIRED_ONCE, function ( Constructor, key, value ) {
    if (Constructor.prototype[key]) {
        throw new Error("policy does not allow '" + key + "' to be defined more than once");
    } else {
        Constructor.prototype[key] = value;
    }
});


module.exports = {
    mixSpecIntoComponent: mixSpecIntoComponent
};