'use strict';

var expect = require('chai').expect;
var PotatoMasher = require('../lib/PotatoMasher');

describe('map', function () {

    it('returns a new object with mapped fields', function () {
        var data = {a: 1, b: 2, c: 3};
        var schema = {a: 'b', c: 'a'};

        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: 2, c: 1});
    });

    it('returns a new object with mapped nested fields', function () {
        var data = {a: 1, b: {a: 21, b: 22, c: 23}, c: 3};
        var schema = {a: 'c', c: 'b.c'};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: 3, c: 23});
    });

    it('returns a new object new fields', function () {
        var data = {a: 1, b: {a: 21, b: 22, c: 23}, c: 3};
        var schema = {b: 'a', lol: 'b.a'};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({b: 1, lol: 21});
    });

    it('works with arrays', function () {
        var data = {a: 1, b: ['one', 'two', 'three']};
        var schema = {b: 'b.1'};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({b: 'two'});
    });

    it('returns a new object with new nested fields', function () {
        var data = {a: 1, b: {a: 2, b: 4, c: 3}};
        var schema = {hey: {ho: 'b.a', dude: 'a'}};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({hey: {ho: 2, dude: 1}});
    });

    it('returns undefined for bad path', function () {
        var data = {a: 1, b: {a: 2, b: 4, c: 3}};
        var schema = {a: 'f', c: 'b.d'};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: undefined, c: undefined});
    });

    it('works with array data 1', function () {
        var data = ['one', 'two', 'three', {hey: 'ho'}];
        var schema = {a: 0, b: '3.hey'};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: 'one', b: 'ho'});
    });

    it('works with array data 2', function () {
        var data = [{hey: 'ho'}, 'two', 'three'];
        var schema = {a: 1, b: '0.hey'};
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: 'two', b: 'ho'});
    });

    it('works with array data 3', function () {
        var data = ['one', 'two', 'three'];
        var schema = [0];
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal(['one']);
    });

    it('returns arrays', function () {
        var data = {a: 1, b: {a: 2, b: 4, c: 3}};
        var schema = ['a', 'b.a', 'b'];
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal([1, 2, {a: 2, b: 4, c: 3}]);
    });

    it('handles function', function () {
        var data = {a: 1, b: {a: 2, b: 4, c: 3}};
        var schema = {
            result: function () {
                return this.a + this.b.c;
            }
        };
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({result: 4});
    });

    it('handles shitty data 1', function () {
        var data;
        var schema = {
            a: 'b'
        };
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: undefined});
    });

    it('handles shitty data 2', function () {
        var data = 123;
        var schema = {
            a: 'b'
        };
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: undefined});
    });

    it('handles shitty data 3', function () {
        var data = null;
        var schema = {
            a: 'b'
        };
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal(data);
    });

    it('handles shitty data 4', function () {
        var data = {a: 1, b: null};
        var schema = {
            a: 'b'
        };
        expect(PotatoMasher.map(data, schema, {keep: true, removeChanged: true}))
            .to
            .deep
            .equal({a: null});
    });

    it('handles shitty schema 1', function () {
        var data = {a: 1, b: 2};
        var schema = 123;
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal(123);
    });

    it('handles shitty schema 2', function () {
        var data = {a: 1, b: 2};
        var schema = null;
        expect(PotatoMasher.map(data, schema))
            .to
            .deep
            .equal({a: 1, b: 2});
    });

    it('keeps old data', function () {
        var data = {a: 1, b: 2, c: 3};
        var schema = {c: 'a'};
        expect(PotatoMasher.map(data, schema, {keep: true}))
            .to
            .deep
            .equal({a: 1, b: 2, c: 1});
    });

    it('keeps old & nested data', function () {
        var data = {a: 1, b: {a: 21, b: 22, c: [6, 7]}, c: 3};
        var schema = {a: 'c', c: 'b.c.1', d: 'b'};
        expect(PotatoMasher.map(data, schema, {keep: true}))
            .to
            .deep
            .equal({a: 3, b: {a: 21, b: 22, c: [6, 7]}, c: 7, d: {a: 21, b: 22, c: [6, 7]}});
    });

    it('keeps old data in arrays', function () {
        var data = ['one', 'two', 'three'];
        var schema = [function () {
            return this.join(', ');
        }];
        expect(PotatoMasher.map(data, schema, {keep: true}))
            .to
            .deep
            .equal(["one", "two", "three", "one, two, three"]);
    });

    it('keeps old data with werd operations', function () {
        var data = {a: [1, 3, 4, 5], b: 42};
        var schema = [{a: 'a.2', b: 'a.0'}];
        expect(PotatoMasher.map(data, schema, {keep: true}))
            .to
            .deep
            .equal([[1, 3, 4, 5], 42, {a: 4, b: 1}]);
    });

    it('removes changed fields 1', function () {
        var data = {a: 1, b: 2, c: 3};
        var schema = {d: 'a'};
        expect(PotatoMasher.map(data, schema, {keep: true, removeChanged: true}))
            .to
            .deep
            .equal({d: 1, b: 2, c: 3});
    });

    it('removes changed fields 2', function () {
        var data = {a: 1, b: {a: 2, b: 4, c: 3}};
        var schema = {d: 'a', e: 'b.b'};
        expect(PotatoMasher.map(data, schema, {keep: true, removeChanged: true}))
            .to
            .deep
            .equal({d: 1, b: {a: 2, c: 3}, e: 4});
    });

    it('removes changed fields 3', function () {
        var data = ['one', 'two', 'three'];
        var schema = {a: 1, b: 2};
        expect(PotatoMasher.map(data, schema, {keep: true, removeChanged: true}))
            .to
            .deep
            .equal(['one']);
    });

    it('removes changed fields 4', function () {
        var data = {a: 1, b: 2, c: [1, 2, 3]};
        var schema = {a: 'b', d: 'c.2'};
        expect(PotatoMasher.map(data, schema, {keep: true, removeChanged: true}))
            .to
            .deep
            .equal({a: 2, c: [1, 2], d: 3});
    });

});