const { model, Schema } = require('mongoose');

const schema = new Schema({
    messages: Array,
    user1: String,
    user2: String,
    date: String
});

module.exports = model('messages', schema);
