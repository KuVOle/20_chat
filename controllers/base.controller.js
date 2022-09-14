const BaseUtil = require('./utils/base.util');

class BaseController extends BaseUtil {

    get(req, res) {
        res.render('../views/base/index');
    }

    async registration(req, res) {
        let status = '';
        if (JSON.stringify(req.body) !== '{}') {
            status = 'err';
            if (await this.checkObligatoryField(req)) {
                await this.createNewUser(req);
                status = 'success';
            }
        }
        res.render('../views/base/registration', { status });
    }

    async activate(req, res) {
        if (await this.checkActivateToken(req))
            res.render('../views/base/activate');
        else
            res.render('../views/base/activate_err');
    }

    async login(req, res) {
        let status = '';
        if (JSON.stringify(req.body) !== '{}') {
            if (await this.checkLoginAndPass(req)) {
                await this.createCookie(req, res);
                return res.redirect('/message');
            }
            else
                status = 'err';
        }
        res.render('../views/base/login', { status });
    }

    async forgot(req, res) {

        let status = '';
        if (JSON.stringify(req.body) !== '{}') {
            if (await this.checkEmail(req.body.email))
                status = 'err';
            else {
                await this.sendRestorePassword(req);
                return res.redirect('/login');
            }
        }
        res.render('../views/base/forgot', { status });
    }

    async getRestore(req, res) {
        let status = 'err';
        let badPassword = '';
        if (await this.checkTokenRestore(req)) {
            status = 'success';
        }
        if (JSON.stringify(req.body) !== '{}') {
            if (await this.changePassword(req))
                return res.redirect('/login');
            else
                badPassword = 'badPassword';
        }
        res.render('../views/base/restore', { status, badPassword });
    }
}

module.exports = new BaseController();