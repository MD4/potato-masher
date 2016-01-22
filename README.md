# PotatoMasher [![Build Status](https://travis-ci.org/MD4/potato-masher.svg?branch=master)](https://travis-ci.org/MD4/potato-masher)
### Map & filter json data easily !

## Installation
```bash
npm install potato-masher
```

## Basic use

For more examples, see unit tests.

### Filter
```javascript
var PotatoMasher = require('potato-masher');

var data = {a: 1, b: {a: 21, b: 22, c: 23}, c: 3};

console.log(PotatoMasher.filter(data, ['a', 'c']));
// {a: 1, c: 3}

console.log(PotatoMasher.filter(data, {b: ['a', 'b'], c: true}));
// {b: {a: 21, b: 22}, c: 3}
```

### Map
```javascript
var PotatoMasher = require('potato-masher');

var data = {a: 1, b: {a: 2, b: 4, c: 3}};

console.log(PotatoMasher.map(data, {a: 'c', b: 'a'}));
// {a: 3, b: 1}

console.log(PotatoMasher.map(data, {hey: {ho: 'b.a', dude: 'a'}}));
// {hey: {ho: 2, dude: 1}}
```

### Closure

```javascript
var PotatoMasher = require('potato-masher');

var myFilter = PotatoMasher.cfilter(['a', 'c']);

console.log(myFilter({a: 1, b: {a: 21, b: 22, c: 23}, c: 3}));
// {a: 1, c: 3}
```

### Functional way

```javascript
var PotatoMasher = require('potato-masher');

var myMap = PotatoMasher.cmap({b: 'a', c: 'b'});
var data = [
    {a: 1, b: 2, c: 3},
    {a: 2, b: 1, c: 2},
    {a: 3, b: 0, c: 3}
];

console.log(data.map(myMap));
/*
[
    {b: 1, c: 2},
    {b: 2, c: 1},
    {b: 3, c: 0}
]
*/
```

## Test (JSHint + mocha)
```bash
npm test
```
