/*
Imports
*/
const express = require('express');
const authRouter = express.Router({ mergeParams: true });
const { register, login } = require('./auth.controller');
const { checkFields, checkBody } = require('../../services/request.checker');
const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../../services/server.response');
//

/*
Routes definition
*/
class AuthRouterClass {

    routes(){
        // HATEOAS
        authRouter.get('/', (req, res) => {

            res.json({
                register_new_user: "/register - POST - body : email, password",
                login: "/login - POST - body : email, password",
            });
        });

        // Register
        // nécessaire : email + mdp
        authRouter.post('/register', (req, res) => {

            // 1 - vérifie si on a bien les champs de rempli
            const hasBody = checkBody(req.body)
            if (!hasBody)
                return sendBodyError( res, 'No data sended' );


            // 2 - vérifie si les informations demandées sont correctes
            const { miss, extra, ok } = checkFields(['password', 'email', 'first_name', 'last_name'], req.body);
            if( !ok )
                return sendFieldsError( res, 'Error with fields provided', miss, extra )


            // 3 - Use controller function
            register(req.body)
                .then( apiResponse => sendApiSuccessResponse(res, 'Welcome !', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'An error as occurred, please try again', apiResponse) )
        });

        // Login
        // nécessaire : email + mdp
        authRouter.post('/login', (req, res) => {

            // 1 - vérifie si on a bien les champs de rempli
            const hasBody = checkBody(req.body)
            if (!hasBody)
                return sendBodyError( res, 'No data sended' );


            // 2 - vérifie si les informations demandées snt correctes
            const { miss, extra, ok } = checkFields(['password', 'email'], req.body);
            if( !ok )
                return sendFieldsError( res, 'Error with fields provided', miss, extra )


            // 3 - Use controller function
            login(req.body)
                .then( apiResponse => sendApiSuccessResponse(res, 'Nice to see you !', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'An error as occurred, please try again', apiResponse) )
        });
    };

    init(){
        this.routes();
        return authRouter;
    }
}
//

/*
Export
*/
    module.exports = AuthRouterClass;
//