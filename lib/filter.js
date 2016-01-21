'use strict';

// exports

/**
 * Overload simulation
 * @param arg1 May be schema or data
 * @param arg2 Schema
 * @public
 */
module.exports = function(arg1, arg2) {
    if (arg2 === undefined) {
        return _buildFilter(arg1);
    }
    return _filter(arg1, arg2);
};

// private

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
 * Returns a new object with fields from data and present in the given schema
 * @param data Object to filter
 * @param schema Fields to keep
 * @returns {*}
 * @private
 */
function _filter(data, schema) {
    if (typeof data !== 'object' ||
        data === null ||
        schema === null) {
        return data;
    }
    if (schema instanceof Array) {
        return _filterByArraySchema(data, schema);
    }
    if (typeof schema === 'object') {
        return _filterByObjectSchema(data, schema);
    }
    return data;
}

/**
 * Filters an object from an array schema
 * @param data Object to filter
 * @param schema Fields to keep
 * @returns {*}
 * @private
 */
function _filterByArraySchema(data, schema) {
    return Object
        .keys(data)
        .filter(function (key) {
            return !!~schema.indexOf(key);
        })
        .reduce(function (memo, key) {
            memo[key] = data[key];
            return memo;
        }, {});
}

/**
 * Filters an object from an object schema
 * @param data Object to filter
 * @param schema Fields to keep
 * @returns {*}
 * @private
 */
function _filterByObjectSchema(data, schema) {
    return Object
        .keys(data)
        .filter(function (key) {
            return schema.hasOwnProperty(key);
        })
        .reduce(function (memo, key) {
            var value = data[key];
            var schemaPart = schema[key];
            if (typeof schemaPart === 'object') {
                memo[key] = _filter(value, schemaPart);
            } else {
                memo[key] = value;
            }
            return memo;
        }, {});
}