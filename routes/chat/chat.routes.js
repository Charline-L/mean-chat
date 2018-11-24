/*
Imports
*/
const express = require('express');
const chatRouter = express.Router({ mergeParams: true });
const { getMessages, addMessage, deleteMessage } = require('./chat.controller');
const { checkFields, checkBody, checkToken, isTokenRegistered } = require('../../services/request.checker');
const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../../services/server.response');
//

/*
Routes definition
*/
class ChatRouterClass {

    routes(){

        // HATEOAS
        chatRouter.get('/', (req, res) => {

            res.json({
                get_all_messages: "/all - GET - header : token",
                add_message: "/add - POST - body : message - header : token",
                delete_message: "/delete - DELETE - body : idMessage - header : token"
            });
        });


        // All
        chatRouter.get('/all', (req, res) => {

            // 1 - vérifie si on a un token
            const hasToken = checkToken(req.headers);

            if (!hasToken)
                return sendBodyError( res, 'No token sent, please log in' );

            // 2 - vérifie si token fourni est valide
            const tokenVerify = isTokenRegistered(req.headers);

            if (!tokenVerify)
                return sendBodyError( res, 'Wrong token provided' );

            // 3 - récupère les messages
            getMessages()
                .then( apiResponse => sendApiSuccessResponse(res, 'All messages', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'An error as occurred, please try again', apiResponse) )
        });

        // Add
        chatRouter.post('/add', (req, res) => {

            // 1 - vérifie si on a bien les champs de rempli
            const hasBody = checkBody(req.body);

            if (!hasBody)
                return sendBodyError( res, 'No data sended' );

            // 2 - vérifie si les informations demandées sont correctes
            const { miss, extra, ok } = checkFields(['message'], req.body);

            if( !ok )
                return sendFieldsError( res, 'Error no message provided', miss, extra );

            // 3 - vérifie si on a un token
            const hasToken = checkToken(req.headers);

            if (!hasToken)
                return sendBodyError( res, 'No token sent, please log in' );

            // 4 - vérifie si token fourni est valide
            const tokenVerify = isTokenRegistered(req.headers);

            if (!tokenVerify)
                return sendBodyError( res, 'Wrong token provided' );

            // 5 - ajoute le message
            addMessage(req.body, tokenVerify)
                .then( apiResponse => sendApiSuccessResponse(res, 'New message added', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'An error as occurred, please try again', apiResponse) )
        });



        // Delete
        chatRouter.delete('/delete', (req, res) => {

            // 1 - vérifie si on a bien les champs de rempli
            const hasBody = checkBody(req.body);

            if (!hasBody)
                return sendBodyError( res, 'No data sended' );

            // 2 - vérifie si les informations demandées sont correctes
            const { miss, extra, ok } = checkFields(['idMessage'], req.body);

            if( !ok )
                return sendFieldsError( res, 'Error no message provided', miss, extra );

            // 3 - vérifie si on a un token
            const hasToken = checkToken(req.headers);

            if (!hasToken)
                return sendBodyError( res, 'No token sent, please log in' );

            // 4 - vérifie si token fourni est valide
            const tokenVerify = isTokenRegistered(req.headers);

            if (!tokenVerify)
                return sendBodyError( res, 'Wrong token provided' );

            // 5 - efface le message
            deleteMessage(req.body, tokenVerify)
                .then( apiResponse => sendApiSuccessResponse(res, 'Your message has been deleted', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'An error as occurred, please try again', apiResponse) )
        });
    };

    init(){
        this.routes();
        return chatRouter;
    }
}
//

/*
Export
*/
module.exports = ChatRouterClass;
//