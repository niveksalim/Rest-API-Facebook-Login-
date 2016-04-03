/**
 * Created by kevin.salim on 3-4-2016.
 */

var Random = require('../utils/random');
var moment = require('moment');
// var mongoose = require('mongoose');

var ApiAccessToken = function(userId, application) {
    this.accessToken = Random.generateApiAccessToken();
    this.issueDate = moment();
    this.expirationDate = moment().add('h', 24).toString();
    this.application = application;
    this.userId = userId;
};

module.exports = ApiAccessToken;