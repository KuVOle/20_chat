const UsersDB = require('../../model/base.model');
const MD5 = require('md5');
const nodemailer = require('nodemailer');


class BaseUtil {

    async checkObligatoryField(req) {
        if (await this.checkEmail(req.body.email) && this.#checkPassword(req.body.password) && await this.#checkLogin(req.body.userName))
            return true;
    }

    async checkEmail(email) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(email) && !(await UsersDB.findOne({ email: email })))
            return true;
    }

    #checkPassword(password) {
        if (password.length > 8)
            return true;
    }

    async #checkLogin(userName) {
        if (!(await UsersDB.findOne({ userName: userName })))
            return true;
    }

    async createNewUser(req) {
        const token_activate = 'token-' + this.#generateHash();

        let message = `<h1>добро пожаловать в приложение Chat!</h1>
        <p>Для активации аккаунта перейдите по ссылке:</p>
        <a href="http://localhost:8833/activate/${token_activate}">Активировать аккаунт</a>`;

        await UsersDB.create({ ...req.body, password: this.#generateHash(req.body.password), token_activate: token_activate, date_registration: new Date() });
        await this.#sendEmail(req.body.email, message);
    }

    #generateHash(param = Date.now()) {
        return MD5(param);
    }

    async #sendEmail(userEmail, message) {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'nodeJSTetMail@yandex.ru',
                pass: '27011995Slava'
            },
        });
        let info = await transporter.sendMail({
            from: '<nodeJSTetMail@yandex.ru>',
            to: `${userEmail}`,
            subject: 'test mail',
            text: `autherization`,
            html: message,
        });
    }

    async checkActivateToken(req) {
        if (await UsersDB.findOne({ token_activate: req.params.token })) {
            await UsersDB.updateOne({ token_activate: req.params.token }, { status: true, token_activate: '' });
            return true;
        }
    }

    async checkLoginAndPass(req) {
        const user = await UsersDB.findOne({ email: req.body.email });
        if (user.password == this.#generateHash(req.body.password))
            return true;
    }

    async sendRestorePassword(req) {
        const user = await UsersDB.findOne({ email: req.body.email });
        const token_restore = 'token_restore-' + this.#generateHash();

        let message = `<h1>Приложение Chat!</h1>
        <p>Вам пришла ссылка для изменения пароля</p>
        <a href="http://localhost:8833/restore/${token_restore}">Изменить пароль</a>
        <p>Если вы не планировали изменять пароль пропустите это сообщение</p>`;

        await UsersDB.updateOne({ email: req.body.email }, { token_restore: token_restore });
        await this.#sendEmail(user.email, message);
        return true;
    }

    async checkTokenRestore(req) {
        if (req.params.token != '' && (await UsersDB.findOne({ token_restore: req.params.token })))
            return true;
    }
    async changePassword(req) {
        if (this.#checkPassword(req.body.password)) {
            await UsersDB.updateOne({ token_restore: req.params.token }, { token_restore: '', password: this.#generateHash(req.body.password) });
            return true;
        }
    }
    async createCookie(req, res) {
        const token_login = 'login-' + this.#generateHash();
        res.cookie('login', token_login);
        await UsersDB.updateOne({ email: req.body.email }, { token_login: token_login });
    }
}

module.exports = BaseUtil;