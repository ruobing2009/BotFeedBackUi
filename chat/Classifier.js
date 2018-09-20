/**
 * Composes modules which provide Intent and Entity analysis capabilities, in this case Rasa NLU.
 */

// services
const rasa = require('./ContactRasa.js');
//const rasa = require('./ContactGossip.js');
exports.parse = parse;


function parse(message, userId, callback) {
    //console.log("Classifier Parse");
    rasa.MesInteractive(message, userId, callback);
}




