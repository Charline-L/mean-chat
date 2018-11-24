/*
Import
*/
const ChatModel = require('../../models/chat.model');
//

/*
Functions
*/
const getMessages = () => {

    // Récupère tous nos messages
    return new Promise( (resolve, reject) => {

        ChatModel.find({}, (error, messages) => {
            if(error){ // Mongo Error
                return reject(error)
            }
            else{
                // si pas de message on renvoit vide
                if (messages.length === 0)
                    return resolve({ empty: true });
                // sinon renvit les messages
                else
                    return resolve({ messages: messages });
            }
        });
    });
};


const addMessage = (body, user) => {

    // Ajouter un message lié à l'utilisateur
    return new Promise( (resolve, reject) => {

        const message = {
            user: user.email,
            message: body.message
        }

        ChatModel.create(message, (error, newMessage) => {
            if(error){ // Mongo error
                return reject(error)
            }
            else{ // User registrated
                return resolve(newMessage);
            }
        });
    });
}

const deleteMessage = (body, user) => {


    // Effacer le message d'un utilisateur
    return new Promise( (resolve, reject) => {

        const userMail = user.email;
        const idMessage = body.idMessage;

       // Récupère le message
        ChatModel.findById(idMessage, (error, message) => {
            if(error){ // Mongo error
                return reject(error);
            }
            else if (!message) {
                return reject("No message founded");
            }
            else{
                // vérifie si l'utilisateur est bien le meme que celui qui est connecté
                if (userMail !== message.user)
                    return reject("You are not allowed to delete this message");

                // efface le message
                ChatModel.deleteOne(message, function (err) {
                    if (err) reject(err);
                    else return resolve(message);
                });
            }
        });
    });
}
//

/*
Export
*/
module.exports = {
    getMessages,
    addMessage,
    deleteMessage
}
//