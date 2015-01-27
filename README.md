# mixin.js

A small library to create powerful factories with useful mixins-based inheritence. Inspired by React.js's createClass factory method.


    var MyLib.classFactory = mixin({

        getInitialStat: mixin.policy.DEFINE_MANY_MERGED,

        render: mixin.policy.DEFINE_ONCE,

        onStart: mixin.policy.DEFINE_MANY,

        updateComponent: mixin.policy.OVERRIDE_BASE

    },{
        initialize: function () {

        },

    });
