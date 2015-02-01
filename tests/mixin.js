var mixin = require('../index');
var assert = require('chai').assert;
var sinon = require('sinon');

describe("mixins", function () {

    var factory = mixin({});

    var fn1 = function(){return 1;};
    var fn2 = function(){return 2;};
    var fn3 = function(){return 3;};

    var mixin1 = {
        fn: fn1
    };

    var mixin2 = {
        fn: fn2
    };


    it("should be ordered from top to bottom", function () {

        var TestClass = factory({
            mixins: [
                mixin1,
                mixin2
            ]
        });

        var proto = TestClass.prototype;

        assert.equal(proto.fn(), 2);
    });

    it("should be ordered from top to bottom", function () {

        var TestClass = factory({
            mixins: [
                mixin1,
                mixin2
            ],
            fn: fn3
        });

        var proto = TestClass.prototype;

        assert.equal(proto.fn(), 3);
    });

});

describe("autoBind", function () {

    var factory = mixin({});

    var fn1 = function(){return this;};

    var mixin1 = {
        fn: fn1
    };

    it("should have non-policy methods bound", function () {

        var TestClass = factory({
            mixins: [
                mixin1
            ]
        });

        var classInstance = new TestClass();
        var fn = classInstance.fn;

        assert.equal(fn(), classInstance);
    });

});

describe("policy.method.MERGE_RESULT", function () {

    var factory = mixin({
        fn: mixin.policy.method.MERGE_RESULT
    });

    var mixin1 = {
        fn: function () {
            return {
                a: "a1",
                //b: "b1"
            };
        }
    };

    var mixin2 = {
        fn: function () {
            return {
                b: "b2",
                //c: "c2"
            };
        }
    };

    var TestClass = factory({
        mixins: [
            mixin1,
            mixin2
        ],
        fn: function () {
            return {
                c: "c3",
                d: "d3"
            };
        }
    });

    var proto = TestClass.prototype;

    it("should merge method results", function () {
        var result = proto.fn();

        assert.isDefined(result);
        assert.equal(result.a, "a1");
        assert.equal(result.b, "b2");
        assert.equal(result.c, "c3");
        assert.equal(result.d, "d3");
    });

});

describe("policy.method.DEFINE_MANY", function () {

    var factory = mixin({
        fn: mixin.policy.method.DEFINE_MANY
    });

    var mixin1 = {
        fn: sinon.spy()
    };

    var mixin2 = {
        fn: sinon.spy()
    };

    var fn3 = sinon.spy();

    var TestClass = factory({
        mixins: [
            mixin1,
            mixin2
        ],
        fn: fn3
    });

    var proto = TestClass.prototype;

    it("should call every function", function () {
        proto.fn();
        assert.isTrue(mixin1.fn.calledOnce);
        assert.isTrue(mixin2.fn.calledOnce);
        assert.isTrue(fn3.calledOnce);
    });

});

describe("policy.method.OVERRIDE_BASE", function () {

    var factory = mixin({
        fn: mixin.policy.method.OVERRIDE_BASE
    });

    var mixin1 = {
        fn: sinon.spy()
    };

    var mixin2 = {
        fn: sinon.spy()
    };

    var fn3 = sinon.spy();

    var TestClass = factory({
        mixins: [
            mixin1,
            mixin2
        ],
        fn: fn3
    });

    var proto = TestClass.prototype;

    it("should call only the bottom-most function", function () {
        proto.fn();
        assert.isFalse(mixin1.fn.called);
        assert.isFalse(mixin2.fn.called);
        assert.isTrue(fn3.calledOnce);
    });

});

describe("policy.method.REQUIRED_ONCE", function () {

    var factory = mixin({
        fn: mixin.policy.method.REQUIRED_ONCE
    });


    it("should throw when defined twice", function () {

        var mixin1 = {
            fn: sinon.spy()
        };

        var fn3 = sinon.spy();

        assert.throws(function () {
            var TestClass = factory({
                mixins: [
                    mixin1
                ],
                fn: fn3
            });
        });
    });

    it("should allow being defined once", function () {

        var fn3 = sinon.spy();

        var TestClass = factory({
            fn: fn3
        });

        TestClass.prototype.fn();

        assert.isTrue(fn3.calledOnce);
    });

});

describe("policy.object.REQUIRED_ONCE", function () {

    var factory = mixin({
        prop: mixin.policy.object.REQUIRED_ONCE
    });


    it("should throw when defined twice", function () {

        var mixin1 = {
            prop: {}
        };

        var prop = {};

        assert.throws(function () {
            var TestClass = factory({
                mixins: [
                    mixin1
                ],
                prop: prop
            });
        });
    });

    it("should allow being defined once", function () {

        var prop = {};

        var TestClass = factory({
            prop: prop
        });

        assert.equal(TestClass.prototype.prop, prop);
    });

});

describe("policy.object.MERGE", function () {

    var factory = mixin({
        merge: mixin.policy.object.MERGE
    });

    var mixin1 = {
        merge: {
            a: "a1",
            b: "b1"
        }
    };

    var mixin2 = {
        merge: {
            b: "b2",
            c: "c2"
        }
    };

    var TestClass = factory({
        mixins: [
            mixin1,
            mixin2
        ]
    });

    var proto = TestClass.prototype;

    it("should merge objects", function () {
        assert.isDefined(proto.merge);
        assert.equal(proto.merge.a, "a1");
        assert.equal(proto.merge.b, "b2");
        assert.equal(proto.merge.c, "c2");
    });

});

describe("policy.object.OVERRIDABLE", function () {

    var factory = mixin({
        prop: mixin.policy.object.OVERRIDABLE
    });

    var mixin1 = {
        prop: {
            a: "a1",
            b: "b1"
        }
    };

    it("should use spec above all", function () {

        var TestClass = factory({
            mixins: [
                mixin1
            ],
            prop: {
                a: "a2",
                b: "b2"
            }
        });

        var proto = TestClass.prototype;

        assert.isDefined(proto.prop);
        assert.equal(proto.prop.a, "a2");
        assert.equal(proto.prop.b, "b2");
    });

    it("should be able to be defined only in a mixin", function () {

        var TestClass = factory({
            mixins: [
                mixin1
            ]
        });

        var proto = TestClass.prototype;

        assert.isDefined(proto.prop);
        assert.equal(proto.prop.a, "a1");
        assert.equal(proto.prop.b, "b1");
    });

});