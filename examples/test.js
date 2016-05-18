var pippiline = require('../index.js');

var dummyParallelFunction = function (params, callback) {
    var duration = Math.floor(Math.random()*1000);
    setTimeout(function () {
        callback(null, params.value);
    }, duration);
}

var dummyWaterfallFn = function (results, callback) {
    var duration = Math.floor(Math.random()*1000);
    setTimeout(function () {
        callback(null, duration);
    }, duration);
}

// array for all tasks
var pl = [];

var parallelTasks = [];
for (var i = 0; i < 5; i++) {
    parallelTasks.push({
        task: dummyParallelFunction,
        params: {value: i}
    });
}
pl.push(parallelTasks);

pl.push(dummyWaterfallFn);

parallelTasks = [];
for (i = 10; i < 12; i++) {
    parallelTasks.push({
        task: dummyParallelFunction,
        params: {value: i}
    });
}
pl.push(parallelTasks);

pl.push(dummyWaterfallFn);
pl.push(dummyWaterfallFn);

parallelTasks = [];
for (i = -2; i < 1; i++) {
    parallelTasks.push({
        task: dummyParallelFunction,
        params: {value: i}
    });
}
pl.push(parallelTasks);

//-----------------------------------
var pippi = new pippiline();
pippi.run(pl, function (err, res) {
    console.log('all done');
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});


/*
pl:
[ [ { task: [Function], params: [Object] },
    { task: [Function], params: [Object] },
    { task: [Function], params: [Object] },
    { task: [Function], params: [Object] },
    { task: [Function], params: [Object] } ],
  [Function],
  [ { task: [Function], params: [Object] },
    { task: [Function], params: [Object] } ],
  [Function],
  [Function],
  [ { task: [Function], params: [Object] },
    { task: [Function], params: [Object] },
    { task: [Function], params: [Object] } ] ]

output:
[ [ 0, 1, 2, 3, 4 ], 759, [ 10, 11 ], 306, 977, [ -2, -1, 0 ] ]
*/