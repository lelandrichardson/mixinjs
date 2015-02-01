var mixin = require('../index');

var MyLib = {};
var React = {};

MyLib.createClass = mixin({

    getInitialStat: mixin.policy.DEFINE_MANY_MERGED,

    render: mixin.policy.DEFINE_ONCE,

    onStart: mixin.policy.DEFINE_MANY,

    updateComponent: mixin.policy.OVERRIDE_BASE

},{
    initialize: function () {

    },

    getInitialState: function () {
        return {};
    }

});



var Factory = mixin({
    getInitialStat: mixin.policy.DEFINE_MANY_MERGED
}, {
    initialize: function () {

    }
});

var MixinA = {
    getInitialState: function () {
        return {
            a: "some",
            b: "thing"
        };
    }
};

var SomeClass = Factory({
    mixins: [
        MixinA
    ],

    getInitialState: function () {
        return {
            b: "thing2",
            c: "thing3"
        };
    }
});


var foo = SomeClass();

foo.getInitialState();

//= { a: "some", b: "thing2", c: "thing3" }



 React.createClass = mixin({

     // this is default
     //mixins: mixin.policy.method.DEFINE_MANY,

     // this is default
     //statics: mixin.policy.method.DEFINE_MANY,

     propTypes: mixin.policy.method.DEFINE_MANY,

     contextTypes: mixin.policy.method.DEFINE_MANY,

     childContextTypes: mixin.policy.method.DEFINE_MANY,

     getDefaultProps: mixin.policy.method.DEFINE_MANY_MERGED,

     getInitialState: mixin.policy.method.DEFINE_MANY_MERGED,

     getChildContext: mixin.policy.method.DEFINE_MANY_MERGED,

     render: mixin.policy.method.DEFINE_ONCE,

     componentWillMount: mixin.policy.method.DEFINE_MANY,

     componentDidMount: mixin.policy.method.DEFINE_MANY,

     componentWillReceiveProps: mixin.policy.method.DEFINE_MANY,

     shouldComponentUpdate: mixin.policy.method.DEFINE_ONCE,

     componentWillUpdate: mixin.policy.method.DEFINE_MANY,

     componentDidUpdate: mixin.policy.method.DEFINE_MANY,

     componentWillUnmount: mixin.policy.method.DEFINE_MANY,

     updateComponent: mixin.policy.method.OVERRIDE_BASE

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