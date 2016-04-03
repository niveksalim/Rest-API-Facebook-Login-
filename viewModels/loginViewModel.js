/**
 * Created by kevin.salim on 3-4-2016.
 */


var LoginViewModel = function(id, username, firstName, lastName, apiAccessToken) {
    this.userId = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.apiAccessToken = apiAccessToken;
}

module.exports = LoginViewModel;