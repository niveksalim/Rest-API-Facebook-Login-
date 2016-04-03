/**
 * Created by kevin.salim on 3-4-2016.
 */

var mongoose = require('mongoose');
var Q = require('q');

var securityTokenSchema = mongoose.Schema({
    apiAccessToken: {type: String, required: true, index: {unique: true}},
    issueDate: {type: Date, required: true},
    expirationDate: {type: Date, required: true},
    application: {type: String, required: true},
    userId: {type: [mongoose.Schema.ObjectId], required: true},
    facebookAccessToken: {type: String, required: true}
});

securityTokenSchema.methods.isExpired = function() {
    return Date.now() > this.expirationDate;
};

securityTokenSchema.statics.createFromApiAndFacebookToken = function(apiToken, fbToken) {
    if (!apiToken || apiToken.accessToken < 32 || !fbToken || fbToken.length === 0) {
        throw new Error('The Api access token and the Facebook user access token are required');
    }
    var obj = new SecurityToken();
    obj.apiAccessToken = apiToken.accessToken;
    obj.issueDate = apiToken.issueDate;
    obj.expirationDate = apiToken.expirationDate;
    obj.application = apiToken.application;
    obj.userId = apiToken.userId;
    obj.facebookAccessToken = fbToken;
    return obj;
};

securityTokenSchema.statics.saveSecurityToken = function(securityToken) {
    var deferred = Q.defer();
    try {
        securityToken.save(function(err, savedSecurityToken) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else {
                deferred.resolve(savedSecurityToken);
            }
        });
    }
    catch (e) {
        deferred.reject(e);
    }
    return deferred.promise;
};

securityTokenSchema.statics.findSecurityToken = function(apiAccessToken) {
    var deferred = Q.defer();
    var query = {
        apiAccessToken: apiAccessToken
    };
    SecurityToken.findOne(
        query,
        function(err, foundSecurityToken) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else {
                deferred.resolve(foundSecurityToken);
            }
        }
    );
    return deferred.promise;
};

securityTokenSchema.statics.removeSecurityToken = function(apiAccessToken) {
    var deferred = Q.defer();
    SecurityToken.remove({ apiAccessToken: apiAccessToken }, function (err) {
        if (err) {
            console.log("In removeSecurityToken: " + err);
            deferred.reject(err);
        }
        else {
            deferred.resolve(apiAccessToken);
        }
    });
    return deferred.promise;
};

securityTokenSchema.statics.removeSecurityTokensForUserId = function(userId) {
    var deferred = Q.defer();
    SecurityToken.remove({ userId: userId }, function (err) {
        if (err) {
            console.log("In removeSecurityToken: " + err);
            deferred.reject(err);
        }
        else {
            deferred.resolve(userId);
        }
    });
    return deferred.promise;
};

securityTokenSchema.statics.authorise = function(apiAccessToken, userId) {
    var deferred = Q.defer();
    SecurityToken.findSecurityToken(apiAccessToken)
        .then(function(securityToken) {
            if (securityToken !== null && !securityToken.isExpired() && securityToken.userId.toString() === userId.toString()) {
                deferred.resolve(true);
            }
            else {
                deferred.resolve(false);
            }
        })
        .fail(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
};

var SecurityToken = mongoose.model('SecurityToken', securityTokenSchema);

module.exports = SecurityToken;