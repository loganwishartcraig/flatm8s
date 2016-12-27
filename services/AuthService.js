// const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../auth/config')

const HashService = require('./HashService');


const _generateToken = (userId) => {
  let payload = {
      sub: userId
    };
  // create a token string
  return jwt.sign(payload, authConfig.secret);
};

const setCredentials = (userId, password) => {

  console.log('\t\tSetting credentials for ', userId, password);

  return new Promise((res, rej) => {

     HashService
      .setHash(userId, password)
      .then(hash => {
        console.log('\t\tset hash');
        res(_generateToken(userId));
      })
      .catch(err => {
        console.log('\t\terror setting hash');
        // SaltService.clearSalt(email);
        rej(err);
      });

  });

};

const verifyPassword = (userId, password) => {

  return new Promise((res, rej) => {

    console.log('\t\tVerifying Password:', userId, password);

    HashService
      .getHash(userId)
      .then(hash => {
        bcrypt.compare(password, hash, (err, valid) => {
          if (valid) res(_generateToken(userId));
          else rej({status: 400, msg: 'Password incorrect'}); 
        });
      })
      .catch(err => {
        rej(err);
      })

  });

};



const updateCredentials = (email, password) => {


};





module.exports = {
  updateCredentials: updateCredentials,
  setCredentials: setCredentials,
  verifyPassword: verifyPassword
  // generateToken: generateToken
}