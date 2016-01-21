'use strict';

var expect = require('chai').expect;
var PotatoMasher = require('../lib/PotatoMasher');

describe('filter', function () {

    it('keeps only given fields', function () {
        var data = {a: 1, b: 2, c: 3};
        var schema = ['b', 'c'];

        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal({b: 2, c: 3});
    });

    it('returns the given value if its not an object', function () {
        var fn = function () {
        };
        expect(PotatoMasher.filter(fn, []))
            .to
            .equal(fn);
        expect(PotatoMasher.filter(42, []))
            .to
            .equal(42);
        expect(PotatoMasher.filter('lol', []))
            .to
            .equal('lol');
        expect(PotatoMasher.filter(true, []))
            .to
            .equal(true);
    });

    it('filters nested objects', function () {
        var data = {a: 1, b: {a: 21, b: 22, c: 23}, c: 3};
        var schema = {b: ['a', 'b'], c: true};

        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal({b: {a: 21, b: 22}, c: 3});
    });

    it('filters nested nested objects', function () {
        var data = {a: 1, b: {a: 21, b: {a: 211, b: 212}, c: 23}, c: 3};
        var schema = {b: {a: true, b: ['a']}, c: true};

        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal({b: {a: 21, b: {a: 211}}, c: 3});
    });

    it('handles shitty data 1', function () {
        var data;
        var schema = ['a'];
        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal(undefined);
    });

    it('handles shitty data 2', function () {
        var data = 123;
        var schema = ['a'];
        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal(123);
    });

    it('handles shitty data 3', function () {
        var data = null;
        var schema = ['a'];
        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal(null);
    });

    it('handles shitty schema 1', function () {
        var data = {a: 1, b: 2};
        var schema = 123;
        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal({a: 1, b: 2});
    });

    it('handles shitty schema 2', function () {
        var data = {a: 1, b: 2};
        var schema = null;
        expect(PotatoMasher.filter(data, schema))
            .to
            .deep
            .equal({a: 1, b: 2});
    });

});
