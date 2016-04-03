/**
 * Created by kevin.salim on 3-4-2016.
 */

function setup(app, handlers, authorisationPolicy) {
    app.post('/api/auth/facebook/mobile', handlers.auth.facebookMobileLogin);
}

exports.setup = setup;