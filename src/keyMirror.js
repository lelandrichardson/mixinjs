var keyMirror = function ( obj, prefix ) {
    prefix = prefix || "";
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = prefix + key;
        }
    }
    return obj;
};

module.exports = keyMirror;