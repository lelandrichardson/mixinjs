var policy = require('./policy');

var coreMixin = {
    /**
     * An array of Mixin objects to include when defining your class.
     *
     * @type {array}
     * @optional
     */
    mixins: "MIXINS",

    /**
     * An object containing properties and methods that should be defined on
     * the class's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: "STATICS",

    /**
     * A function that can be used to initialize an instance
     *
     * @type {function}
     * @optional
     */
    initialize: policy.method.DEFINE_MANY,

    /**
     * Mainly for debugging purposes. This is the name applied to the constructor function.
     *
     * @type {String}
     * @optional
     */
    displayName: "CONSTRUCTOR_DISPLAY_NAME"
};

module.exports = coreMixin;