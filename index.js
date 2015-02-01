
var mixin = require('./src/factory');
var handlers = require('./src/handlers');
var warn = require('./src/warn');

mixin.policy = require('./src/policy');

mixin.addPolicy = function ( constant, handler ) {
    if (handlers.hasOwnProperty(constant)) {
        warn("A handler for policy named '" + constant + "' already exists!");
        return;
    }
    handlers[constant] = handler;
};

module.exports = mixin;