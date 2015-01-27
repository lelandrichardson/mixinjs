/**
 *
 */
var policy = {
    /**
     * These methods may be defined only once by the class specification or mixin.
     */
    DEFINE_ONCE: "DEFINE_ONCE",

    /**
     * These methods may be defined by both the class specification and mixins.
     * Subsequent definitions will be chained. These methods must return void.
     */
    DEFINE_MANY: "DEFINE_MANY",

    /**
     * These methods are overriding the base class.
     */
    OVERRIDE_BASE: "OVERRIDE_BASE",

    /**
     * These methods are similar to DEFINE_MANY, except we assume they return
     * objects. We try to merge the keys of the return values of all the mixed in
     * functions. If there is a key conflict we throw.
     */
    DEFINE_MANY_MERGED: "DEFINE_MANY_MERGED"
};

module.exports = policy;