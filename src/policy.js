var keyMirror = require('./keyMirror');

/**
 *
 */
var policy = {

    method: keyMirror({

        /**
         * These methods may be defined only once by the class specification or mixin.
         */
        REQUIRED_ONCE: null,

        /**
         * These methods may be defined by both the class specification and mixins.
         * Subsequent definitions will be chained. These methods must return void.
         */
        DEFINE_MANY: null,

        /**
         * These methods are overriding the base class.
         */
        OVERRIDABLE: null,

        /**
         * These methods are similar to DEFINE_MANY, except we assume they return
         * objects. We try to merge the keys of the return values of all the mixed in
         * functions. If there is a key conflict we throw.
         */
        MERGE_RESULT: null

    }, "METHOD_"),

    object: keyMirror({

        /**
         * These methods may be defined only once by the class specification or mixin.
         */
        REQUIRED_ONCE: null,

        /**
         * These methods may be defined by both the class specification and mixins.
         * Subsequent definitions will be chained. These methods must return void.
         */
        MERGE: null,

        /**
         * These methods are overriding the base class.
         */
        OVERRIDABLE: null

    }, "OBJECT_")

};

module.exports = policy;