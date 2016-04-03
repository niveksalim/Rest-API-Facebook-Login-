/**
 * Created by kevin.salim on 3-4-2016.
 */

var winston = require('winston');

function log(level, message) {
    winston.log(level, message);
}

exports.log = log;