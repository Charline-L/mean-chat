/*
Imports & configs
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//


/*
Model definition
*/
const messageSchema = new Schema({
    user: String,
    message: String
})
//

/*
Export
*/
const messageModel = mongoose.model('chat', messageSchema);
module.exports = messageModel;
//