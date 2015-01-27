var existential = {

    isObject: function ( obj ) {
        return !!obj && typeof obj === 'object';
    },

    isUndefined: function ( obj ) {
        return obj === undefined;
    },

    isFunction: function ( fn ) {
        return typeof fn === 'function';
    }

};

module.exports = existential;