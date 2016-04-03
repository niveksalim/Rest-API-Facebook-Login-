/**
 * Created by kevin.salim on 3-4-2016.
 */

var Account = require('../models/Account');
var logger = require('../utils/logger');
var Q = require('q');

function AccountRepository() {
    this.findById = findAccountById;
    this.createAccount = createAccount;
    this.findAccountByUsername = findAccountByUsername;
    this.updateAccount = updateAccount;
    this.updateLastLoginDate = updateLastLoginDate;
    this.disableAccount = disableAccount;
    this.findOrCreateAccount = findOrCreateAccount;
}

function findAccountById(id) {
    var deferred = Q.defer();
    var query = {
        _id: id
    };
    Account.findOne(query, function(err, profile) {
        if (err) {
            deferred.reject(new Error(err));
        }
        else {
            deferred.resolve(profile);
        }
    });
    return deferred.promise;
}

function createAccount(username, password, firstName, lastName, email, facebookUserId) {
    var deferred = Q.defer();
    var account = new Account({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        facebookUserId: facebookUserId || null,
        email: email
    });
    account.save(function(err, account) {
        if (err) {
            deferred.reject(new Error(err));
        }
        else {
            deferred.resolve(account);
        }
    });
    return deferred.promise;
}

function findAccountByUsername(username) {
    var deferred = Q.defer();
    Account.findOne({
        username: username
    }, function(err, foundUsername) {
        if (err) {
            deferred.reject(new Error(err));
        }
        else {
            deferred.resolve(foundUsername);
        }
    });
    return deferred.promise;
}

function updateAccount(account) {
    var deferred = Q.defer();
    var query = {
        username: account.username
    };
    var options = {
        'new': true
    };
    Account.findOneAndUpdate(query,
        {
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email
        },
        options,
        function(err, account) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else {
                deferred.resolve(account);
            }
        }
    );
    return deferred.promise;
}

function updateLastLoginDate(account, lastLogin) {
    var deferred = Q.defer();
    var query = {
        username: account.username
    };
    var options = {
        'new': true
    };
    Account.findOneAndUpdate(query,
        {
            lastLogin: lastLogin
        },
        options,
        function(err, account) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else {
                deferred.resolve(account);
            }
        }
    );
    return deferred.promise;
}

function disableAccount(userId) {
    var deferred = Q.defer();
    var query = {
        _id: userId
    };
    var options = {
        'new': true
    };
    Account.findOneAndUpdate(query,
        {
            isActive: false,
            canLogin: false
        },
        options,
        function(err, account) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else {
                deferred.resolve(account);
            }
        }
    );
    return deferred.promise;
}

function findOrCreateAccount(username, facebookUserId, email, firstName, lastName) {
    var deferred = Q.defer();
    this.findAccountByUsername(username)
        .then(function(account) {
            if (account && account.username && account.username !== '') {
                deferred.resolve(account); // Found!
            }
            else {
                // Let's create the account
                createAccount(username, ' ', firstName, lastName, email, facebookUserId)
                    .then(function(account) {
                        deferred.resolve(account);
                    });
            }
        })
        .fail(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

module.exports = AccountRepository;