var mixing = require('./mixing');
var coreMixin = require('./coreMixin');
var assign = require('object-assign');

function bindAutoBindMethod ( component, method ) {
    return method.bind(component);
}

function bindAutoBindMethods ( obj ) {
    for (var autoBindKey in obj.__autoBind) {
        if (obj.__autoBind.hasOwnProperty(autoBindKey)) {
            var method = obj.__autoBind[autoBindKey];
            obj[autoBindKey] = bindAutoBindMethod(obj, method);
        }
    }
}

var factory = function ( classPolicy, base ) {

    var policy = assign({}, coreMixin, classPolicy);

    return function ( spec ) {
        var Constructor = function () {
            // Wire up auto-binding
            if (this.__autoBind) {
                bindAutoBindMethods(this);
            }

            if (this.initialize) {
                this.initialize.call(this, arguments);
            }
        };
        mixing.mixSpecIntoComponent(Constructor, base, policy);
        mixing.mixSpecIntoComponent(Constructor, spec, policy);

        return Constructor;
    };
};

module.exports = factory;