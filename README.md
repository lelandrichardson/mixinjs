# mixin.js

A small library to create powerful factories with useful mixins-based inheritence. Inspired by React.js's createClass factory method.

```javascript
var MyLib.classFactory = mixin({

    getInitialStat: mixin.policy.method.MERGE_RESULT,

    render: mixin.policy.method.REQUIRED_ONCE,

    onStart: mixin.policy.method.DEFINE_MANY,

    updateComponent: mixin.policy.method.OVERRIDABLE

},{
    initialize: function () {

    },

});
```


This library is heavily inspired by the behavior of React's `createClass` method. This factory method has subtle
complexity. mixins are able to be defined, and the mixins allow overriding of some methods, and special handling of
others such as `getInitialState()` and `propTypes`.

Using the mixinjs library, we could create a factory method very similar to React's `createClass` method as shown below:

```javascript
var mixin = require('mixin');

var React = {};

React.createClass = mixin({

    // this is provided by default
    //mixins: mixin.policy.method.DEFINE_MANY,

    // this is provided by default
    //statics: mixin.policy.method.DEFINE_MANY,

    propTypes: mixin.policy.object.MERGE,

    contextTypes: mixin.policy.object.MERGE,

    childContextTypes: mixin.policy.object.MERGE,

    getDefaultProps: mixin.policy.method.MERGE_RESULT,

    getInitialState: mixin.policy.method.MERGE_RESULT,

    getChildContext: mixin.policy.method.MERGE_RESULT,

    render: mixin.policy.method.REQUIRED_ONCE,

    componentWillMount: mixin.policy.method.DEFINE_MANY,

    componentDidMount: mixin.policy.method.DEFINE_MANY,

    componentWillReceiveProps: mixin.policy.method.DEFINE_MANY,

    shouldComponentUpdate: mixin.policy.method.REQUIRED_ONCE,

    componentWillUpdate: mixin.policy.method.DEFINE_MANY,

    componentDidUpdate: mixin.policy.method.DEFINE_MANY,

    componentWillUnmount: mixin.policy.method.DEFINE_MANY,

    updateComponent: mixin.policy.method.OVERRIDABLE

}, {
    initialize: function (props, context) {
        this.props = props;
        this.context = context;
        this.state = this.getInitialState();
    },

    isMounted: function () {

    },

    setProps: function (newProps, callback) {

    },

    replaceProps: function (newProps, callback) {

    }
});
```

Mixinjs has the following function signature:

    var factory = mixin(policy [, baseImplementation]);


## Policies

`policy` is an object with prop names and their corresponding policy declarations.  The following policy
declarations are available by default:


Policy | Behavior
------ | --------
`mixin.policy.method.REQUIRED_ONCE` | The corresponding method can only be implemented once. Multiple definitions will throw
`mixin.policy.method.DEFINE_MANY` | The corresponding method can be defined as many times as you want. When calling the method, each definition will be invoked sequentially.
`mixin.policy.method.MERGE_RESULT` | The corresponding method can be defined as many times as you want. It is expected that the method definitions return objects, and the results of each are merged together.
`mixin.policy.method.OVERRIDABLE` | The corresponding method can be defined as many times as you want, but only the bottom-most definition will be used.
`mixin.policy.object.REQUIRED_ONCE` | The corresponding property can only be defined once. Multiple definitions will throw.
`mixin.policy.object.MERGE` | The corresponding property can be defined as many times as you want, and each definition will be merged together.
`mixin.policy.object.OVERRIDABLE` | The corresponding property can be defined as many times as you want, but only the bottom-most definition will be used.


## Add your own

You can add your own policy by making the following call:

    mixin.addPolicy("MY_CUSTOM_POLICY", function (Constructor, propName, prop, classPolicy) {
        // do what you need to do here. Default behavior could be emulated as:
        Constructor.prototype[propName] = prop;
    });

## Default Policy Behaviors

By default, each class factory created using mixin has the following policy defined:

    {
        /**
         * An array of Mixin objects to include when defining your class. Recursive.
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
        initialize: mixin.policy.method.DEFINE_MANY,

        /**
         * Mainly for debugging purposes. This is the displayName applied to the constructor function.
         *
         * @type {String}
         * @optional
         */
        displayName: "CONSTRUCTOR_DISPLAY_NAME"
    }



You can use an `initialize` method to any mixin or implementation and it will be used on instance initialization.