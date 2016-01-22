'use strict';

// exports

module.exports.cfilter = _buildFilter;
module.exports.cmap = _buildMap;

// private

var  _filter = require('./filter');
var  _map = require('./map');

/**
 * Returns a closure with schema
 * @param schema Filter schema
 * @returns {Function}
 * @private
 */
function _buildFilter(schema) {
    return function(data) {
        return _filter(data, schema);
    };
}

/**
 * Returns a closure with schema
 * @param schema Map schema
 * @param options Options
 * @returns {Function}
 * @private
 */
function _buildMap(schema, options) {
    options = options || {};
    return function(data) {
        return _map(data, schema, options);
    };
}
