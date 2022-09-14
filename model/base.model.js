const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: String,
    userName: String,
    dataReg: String,
    password: String,
    token_activate: String,
    token_restore: String,
    status: { type: Boolean, default: false },
    token_login: String,
    date_registration: String,
    arr_contacts: Array

});

module.exports = model('Users', schema);