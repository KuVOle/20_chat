const UsersDB = require('../../model/base.model');
const messageDB = require('../../model/message.model');

class MessageUtil {

    async checkMissingToken(req) {
        if (req.cookies.login == undefined || !(await UsersDB.findOne({ token_login: req.cookies.login })))
            return true;
    }

    async addNewContact(req) {
        if (await this.#checkRealLogin(req) && ! await this.#checkDuplicate(req)) {
            const newContact = await UsersDB.findOne({ userName: req.body.newContact });
            if (newContact) {
                const messageID = await this.#createMessageDB(req);
                const who = (await UsersDB.findOne({ token_login: req.cookies.login })).userName;
                await UsersDB.updateOne({ token_login: req.cookies.login }, { $push: { arr_contacts: { id: messageID, login: newContact.userName } } });
                await UsersDB.updateOne({ userName: newContact.userName }, { $push: { arr_contacts: { id: messageID, login: who } } });
                return true;
            }
        }
    }
    async #checkRealLogin(req) {
        if (await UsersDB.findOne({ login: req.body.newContact })) {
            return true;
        }
    }
    async #checkDuplicate(req) {
        const check = await UsersDB.findOne({ token_login: req.cookies.login });
        if (check.arr_contacts.find(el => el.login == req.body.newContact))
            return true;
    }
    async getContacts(req) {
        const check = await UsersDB.findOne({ token_login: req.cookies.login });
        return check.arr_contacts;
    }
    async #createMessageDB(req) {
        const check = await messageDB.create({ user1: req.body.newContact, user2: (await UsersDB.findOne({ token_login: req.cookies.login })).userName, messages: [] })
        return check._id;
    }
    checkSendAndMessage(req) {
        if (req.body.message != '' && req.body.send == '')
            return true;
    }
    async writeInMessageDB(req) {
        await messageDB.updateOne({ _id: req.params.id }, { $push: { messages: { date: new Date(), message: req.body.message, who: (await UsersDB.findOne({ token_login: req.cookies.login })).userName } } });
    }
    async getMessageList(req) {
        const messagesList = await messageDB.findById(req.params.id);
        if (messagesList == null) {
            return [];
        }
        return messagesList.messages;
    }
    async who(req) {
        return (await UsersDB.findOne({ token_login: req.cookies.login })).userName;
    }
}


module.exports = MessageUtil;