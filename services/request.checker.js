/*
* Imports
* */
require('dotenv').config();
const jwt = require('jsonwebtoken');

/*
Créer des fonctions pour vérifier les données d'une requête
*/
const checkFields = ( required, reqBody ) => {
    // Création de tableau pour les champs manquants ou en trop
    let miss = [];
    let extra = [];

    // Vérifier qu'il ne manque pas de champs
    required.forEach( prop => {
        if( !(prop in reqBody) ) {
            console.log('MISS', prop)
            miss.push(prop)
        };
    });

    // Vérifier les champs en trop
    for( const prop in reqBody ){
        if( required.indexOf(prop) === -1 ) {
            console.log('EXTRA', prop)
            extra.push(prop)
        };
        
    };

    // Vérifier les champs
    const ok = ( extra.length === 0 && miss.length === 0 );

    // Renvoyer le résultat
    return { ok, extra, miss };
}

const checkBody = (body) => {

    // vérifie si on a les informations demandées
    return !( typeof body === 'undefined' || body === null || Object.keys( body ).length === 0 )
}


const checkToken = (header) => {

    // vérifie si on a bien le token
    return !( typeof header.authorization === 'undefined' || header.authorization === null )
}

const isTokenRegistered = (header) => {

    const tokenArray = header.authorization.split(" ");
    const token = jwt.decode(tokenArray[1]);

    return token === null ? false : token
}
//

/*
Exporter le module du service
*/
module.exports = { checkFields, checkBody, checkToken, isTokenRegistered };
//