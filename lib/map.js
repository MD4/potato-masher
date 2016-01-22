'use strict';

// exports

module.exports = _mainMap;

// private

var _separator = '.';

/**
 * Main map function
 * Returns a new object with its new aspect given by the schema
 * @param data
 * @param schema
 * @param options
 * @returns {*}
 * @private
 */
function _mainMap(data, schema, options) {
    options = options || {};
    var mapping = _map(data, schema, options);
    if (options.removeChanged) {
        var mappedFields = _getMappedFields(schema);
        mappedFields.forEach(function (field) {
            _removeMappedFields(mapping, field);
        });
        mapping = _cleanArrays(mapping);
    }
    return mapping;
}

/**
 * Returns a new object with its new aspect given by the schema
 * @param data Object to map
 * @param schema Fields to map
 * @param options Options
 * @returns {*}
 * @private
 */
function _map(data, schema, options) {
    options = options || {};
    if (!schema || data === null) {
        return data;
    }
    if (schema instanceof Array) {
        return _mapArray(data, schema, options);
    }
    if (typeof schema === 'object') {
        return _mapObject(data, schema, options);
    }
    return schema;
}

/**
 *
 * @param mapping
 * @returns {*}
 * @private
 */
function _cleanArrays(mapping) {
    if (mapping instanceof Array) {
        return mapping
            .filter(function (value) {
                return value !== undefined;
            })
            .map(function (value) {
                return _cleanArrays(value);
            });
    }
    if (typeof mapping === 'object') {
        return Object
            .keys(mapping)
            .reduce(function (memo, key) {
                memo[key] = _cleanArrays(mapping[key]);
                return memo;
            }, {});
    }
    return mapping;
}

/**
 * !! Function with side effects !!
 * Removes given fields of a dataset
 * @param mapping Data to clean
 * @param path Path to field to delete
 * @returns {*}
 * @private
 */
function _removeMappedFields(mapping, path) {
    if (typeof path === 'number') {
        delete mapping[path];
        return mapping;
    }
    var keys = path.split(_separator);
    if (keys.length <= 1) {
        delete mapping[path];
        return mapping;
    }
    return _removeMappedFields(
        mapping[path[0]],
        keys
            .slice(1)
            .join(_separator)
    );
}

/**
 * Returns the fields which are used in the final object
 * @param schema Target schema
 * @returns {*}
 * @private
 */
function _getMappedFields(schema) {
    if (schema === undefined ||
        schema === null) {
        return;
    }
    if (schema instanceof Array) {
        return schema
            .reduce(function (memo, key) {
                var mappedField = _getMappedFields(key);
                if (mappedField !== undefined) {
                    memo = memo.concat(mappedField);
                }
                return memo;
            }, []);
    }
    if (typeof schema === 'object') {
        return Object
            .keys(schema)
            .reduce(function (memo, key) {
                var mappedField = _getMappedFields(schema[key]);
                if (mappedField !== undefined) {
                    memo = memo.concat(mappedField);
                }
                return memo;
            }, []);
    }
    if (typeof schema === 'string' ||
        typeof schema === 'number') {
        return schema;
    }
}

/**
 * Returns a new object with its new aspect from an array schema
 * @param data Object to map
 * @param schema Fields to map
 * @param options Options
 * @returns {*}
 * @private
 */
function _mapArray(data, schema, options) {
    var base = [];
    if (data instanceof Array && options.keep) {
        base = _clone(data);
    }
    if (typeof data === 'object') {
        base = Object
            .keys(data)
            .map(function(key) {
                return data[key]
            });
    }
    return schema
        .reduce(function (memo, nestedSchema) {
            memo.push(_mapDataValue(data, nestedSchema));
            return memo;
        }, base);
}

/**
 * Returns a new object with its new aspect from an object schema
 * @param data Object to map
 * @param schema Fields to map
 * @param options Options
 * @returns {*}
 * @private
 */
function _mapObject(data, schema, options) {
    return Object
        .keys(schema)
        .reduce(function (memo, key) {
            memo[key] = _mapDataValue(data, schema[key]);
            return memo;
        }, options.keep ? _clone(data) : {});
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
    if (data === undefined) {
        return undefined;
    }
    if (typeof path === 'number') {
        return data[path];
    }
    if (typeof path === 'string') {
        var keys = path.split(_separator);
        if (keys.length <= 1) {
            return data[keys[0]];
        }
        return _getDataValue(
            data[keys[0]],
            keys
                .slice(1)
                .join(_separator)
        );
    }
    return undefined;
}

/**
 * Clone an object
 * @param data Object to clone
 * @private
 */
function _clone(data) {
    return JSON.parse(JSON.stringify(data));
}