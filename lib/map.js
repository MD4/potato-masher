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
        return _buildMap(arg1);
    }
    return _map(arg1, arg2);
};

// private

/**
 * Returns a closure with schema
 * @param schema Map schema
 * @returns {Function}
 * @private
 */
function _buildMap(schema) {
    return function(data) {
        return _map(data, schema);
    };
}

/**
 * Returns a new object with its new aspect given by the schema
 * @param data Object to map
 * @param schema Fields to map
 * @returns {*}
 * @private
 */
function _map(data, schema) {
    if (!schema || data === null) {
        return data;
    }
    if (schema instanceof Array) {
        return _mapArray(data, schema);
    }
    if (typeof schema === 'object') {
        return _mapObject(data, schema);
    }
    return schema;
}

/**
 * Returns a new object with its new aspect from an array schema
 * @param data Object to map
 * @param schema Fields to map
 * @returns {*}
 * @private
 */
function _mapArray(data, schema) {
    return schema
        .reduce(function (memo, nestedSchema) {
            memo.push(_mapDataValue(data, nestedSchema));
            return memo;
        }, []);
}

/**
 * Returns a new object with its new aspect from an object schema
 * @param data Object to map
 * @param schema Fields to map
 * @returns {*}
 * @private
 */
function _mapObject(data, schema) {
    return Object
        .keys(schema)
        .reduce(function (memo, key) {
            memo[key] = _mapDataValue(data, schema[key]);
            return memo;
        }, {});
}

/**
 * Returns the value of an object from a nested schema
 * @param data Object to map
 * @param nestedSchema Path to value, function to execute or nested schema
 * @returns {*}
 * @private
 */
function _mapDataValue(data, nestedSchema) {
    if (typeof nestedSchema === 'function') {
        return nestedSchema.apply(data);
    } else if (typeof nestedSchema === 'object') {
        return _map(data, nestedSchema);
    } else {
        return _getDataValue(data, nestedSchema);
    }
}

/**
 * Returns the value of an object from its path
 * @param data Object to map
 * @param path Path to value in object
 * @returns {*}
 * @private
 */
function _getDataValue(data, path) {
    var separator = '.';
    if (data === undefined) {
        return undefined;
    }
    if (typeof path === 'number') {
        return data[path];
    }
    if (typeof path === 'string') {
        var keys = path.split(separator);
        if (keys.length <= 1) {
            return data[keys[0]];
        }
        return _getDataValue(
            data[keys[0]],
            keys
                .slice(1)
                .join(separator)
        );
    }
    return undefined;
}