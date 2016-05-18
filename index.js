var async = require('async');

var PippiLine = function PippiLine (options) {
    options = options || {};
    this.verboseOutput = options.verboseOutput;
    this._tasks = [];
    this._results = [];
    return this;
};

PippiLine.prototype.addParallelTask = function addParallelTask (pipeTasks) {
    var _tasks = [];
    
    pipeTasks.forEach(function (pipeTask, index) {
        if (typeof pipeTask.task !== 'function') {
            logging('Task should be function. ', pipeTask.task, ' is not a function (at pipe index ', index, ' ).');
            return;
        } 
        
        if (!pipeTask.params) {
            logging('Params for task should be defined (at pipe index ', index, ' ).');
            return;
        }
        
        _tasks.push(function (cb) {
            pipeTask.task(pipeTask.params, function (err, res) {                
                cb(err, res);
            });
        });
        
    }.bind(this));
    
    return function () {
        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
        } else {
            callback = arguments[1];
            this._results.push(arguments[0]);
        }
        
        async.parallel(_tasks, callback);
    };
};

PippiLine.prototype.run = function (pipeline, callback) {
    if (!callback && this.options.verboseOutput) {
        console.warn('Warning: Callback not defined');
    }
    
    pipeline.forEach(function (pipeTask, index) {
        
        if (pipeTask instanceof Array) {    
            this._tasks.push(this.addParallelTask(pipeTask).bind(this));
        } else if (typeof pipeTask === 'function') {
            this._tasks.push(function (prevResults, cb) {
                this._results.push(prevResults);
                pipeTask(this._results, cb);
            }.bind(this));
            
        } else {
            logging('Pipeline should be Array of Objects and/or Functions. ', pipeTask, ' is not an Object nor Function (at pipe index ', index, ' ).');
        }
    }.bind(this));

    async.waterfall(this._tasks, function (err, res) {
        this._results.push(res);
        if (!err) {
            callback(null, this._results);
        } else {
            callback(err, this._results);
        }
    }.bind(this));
};

module.exports = PippiLine;
