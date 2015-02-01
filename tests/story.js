var mixin = require('mixin');

var React = {};

React.createClass = mixin({

    // this is provided by default
    //mixins: mixin.policy.method.DEFINE_MANY,

    // this is provided by default
    //statics: mixin.policy.method.DEFINE_MANY,

    propTypes: mixin.policy.object.MERGE,

    contextTypes: mixin.policy.object.MERGE,

    childContextTypes: mixin.policy.method.DEFINE_MANY,

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