'use strict';

var authConfig = require('./waterlock-local-auth').authConfig;

/**
 * TODO these can be refactored later
 * @type {Object}
 */

module.exports = function(Auth, engine){
  var def = Auth.definition;

  if(typeof def.email !== 'undefined'){
    return generateScope('email', engine);
  }else if(typeof def.username !== 'undefined'){
    return generateScope('username', engine);
  }else{
    var error = new Error('Auth model must have either an email or username attribute');
    throw error;
  }
};

function generateScope(scopeKey, engine){
  return {
    type: scopeKey,
    engine: engine,
    getUserAuthObject: function(attributes, req, cb){
      var attr = {password: attributes.password};
      attr[scopeKey] = attributes[scopeKey];

      var criteria = {};
      criteria[scopeKey] = attr[scopeKey];

      this.engine.findAuth(criteria, cb);
    },
    registerUserAndLogin: function(attributes, req, cb){
      var attr = {password: attributes.password};
      attr[scopeKey] = attributes[scopeKey];

      var criteria = {};
      criteria[scopeKey] = attr[scopeKey];

      if(authConfig.createOnNotFound){
        this.engine.findOrCreateAuth(criteria, attributes, cb);
      }
    }
  };
}
