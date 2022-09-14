const MessageUtil = require('./utils/message.util');


class MessageController extends MessageUtil {


    async get(req, res) {
        if (await this.checkMissingToken(req))
            return res.redirect('/login');

        let contacts = await this.getContacts(req);
        let messages = [];
        let who = await this.who(req);
        res.render('../views/app/message', { contacts, messages, who });
    }
    async add(req, res) {
        if (await this.checkMissingToken(req))
            return res.redirect('/login');

        if (req.body.addNewContact == '') {
            await this.addNewContact(req);
        }

        if (this.checkSendAndMessage(req)) {
            await this.writeInMessageDB(req);
        }

        let contacts = await this.getContacts(req);
        let messages = await this.getMessageList(req);
        let who = await this.who(req);

        res.render('../views/app/message', { contacts, messages, who });
    }

}

module.exports = new MessageController();