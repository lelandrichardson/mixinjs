var mixing = require('./mixing');
var assign = require('object-assign');

/**
 *
 */
var handlers = {

    /**
     * Custom policy Handlers for core mixin.
     */
    CONSTRUCTOR_DISPLAY_NAME: function ( Constructor, propName, prop ) {
        Constructor.displayName = displayName;
    },

    MIXINS: function ( Constructor, propName, prop ) {
        if (prop) {
            for (var i = 0; i < prop.length; i++) {
                mixing.mixSpecIntoComponent(Constructor, prop[i]);
            }
        }
    },

    STATICS: function ( Constructor, key, value ) {
        mixing.mixStaticSpecIntoComponent(Constructor, value);
    },


    /**
     * Public policy handlers.
     */

    DEFINE_ONCE: function ( Constructor, key, value ) {

    },

    OBJECT_DEFINE_MANY_MERGE: function ( Constructor, propName, prop ) {
        Constructor[propName] = assign({}, Constructor[propName], prop);
    },

    METHOD_DEFINE_MANY_MERGE: function ( Constructor, methodName, method ) {
        if (Constructor[methodName]) {
            Constructor[methodName] = mixing.createMergedResultFunction(
                Constructor[methodName],
                method
            );
        } else {
            Constructor[methodName] = method;
        }
    },

    METHOD_DEFINE_MANY: function ( Constructor, methodName, method ) {

    },

    METHOD_OVERRIDABLE: function ( Constructor, methodName, method ) {
        Constructor[methodName] = method;
    }
};

module.exports = handlers;