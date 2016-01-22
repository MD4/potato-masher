'use strict';

var expect = require('chai').expect;
var PotatoMasher = require('../lib/PotatoMasher');

describe('functional compliance', function () {

    it('allow to use filter in a functional way', function () {
        var data = [
            {a: 1, b: 2, c: 3},
            {a: 2, b: 1, c: 2},
            {a: 3, b: 0, c: 3},
            {a: 4, b: -1, c: 2}
        ];
        var schema = ['b', 'c'];
        expect(
            data.map(PotatoMasher.cfilter(schema))
        )
            .to
            .deep
            .equal([
                {b: 2, c: 3},
                {b: 1, c: 2},
                {b: 0, c: 3},
                {b: -1, c: 2}
            ]);

    });

    it('allow to use map in a functional way', function () {
        var data = [
            {a: 1, b: 2, c: 3},
            {a: 2, b: 1, c: 2},
            {a: 3, b: 0, c: 3},
            {a: 4, b: -1, c: 2}
        ];
        var schema = {b: 'a', c: 'b'};
        expect(
            data.map(PotatoMasher.cmap(schema))
        )
            .to
            .deep
            .equal([
                {b: 1, c: 2},
                {b: 2, c: 1},
                {b: 3, c: 0},
                {b: 4, c: -1}
            ]);

    });

});