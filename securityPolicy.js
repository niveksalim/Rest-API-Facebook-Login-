/**
 * Created by kevin.salim on 3-4-2016.
 */
var SecurityToken = require('./infrastructure/securityToken');
var logger = require('./utils/logger');

function authorise(req, res, next) {
    var apiAccessToken = req.body.apiAccessToken || null;
    var userId = req.params.userId || req.body.userId || null;
    if (apiAccessToken && userId) {
        SecurityToken.authorise(apiAccessToken, userId)
            .then(function(authorised) {
                if (authorised) {
                    next();
                }
                else {
                    logger.log('info', 'User ' + userId + ' is not authorised. Request from address ' + req.connection.remoteAddress + '.');
                    res.json(401, {
                        error: "User is not authorised"
                    });
                }
            }, function(err) {
                logger.log('error', 'An error has occurred while processing a request ' +
                    ' from ' +
                    req.connection.remoteAddress + '. Stack trace: ' + err.stack);
                res.json(500, {
                    error: err.message
                });
            });
    }
    else {
        logger.log('info', 'Bad request from ' +
            req.connection.remoteAddress + '. Api access token and user id are mandatory.');
        res.json(400, {
            error: 'Api access token and user id are mandatory.'
        });
    }
}

exports.authorise = authorise;