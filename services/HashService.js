const mongoose = require('mongoose'),
      HashModel = require('../models/HashModel');

const bcrypt = require('bcryptjs');

const _genrateHash = (password, salt) => {

  return new Promise((res, rej) => {

    bcrypt.hash(password, 12, (err, hash) => {
      if (err) rej(err);
      else res(hash);  
    });
    
  });

};

const getHash = (userId) => {

  return new Promise((res, rej) => {

    HashModel
      .findOne({userId: userId})
      .then(hashRecord => {
        console.log('\t\tHash Found');
        if (hashRecord) res(hashRecord.hash);
        else rej({status: 500, msg: 'Error processing credentials'});
      })
      .catch(err => {
        console.log('\t\tError looking up hash');
        rej({status: 500, msg: 'Error processing credentials'});
      });  

  });

};

const setHash = (userId, password) => {

  return new Promise((res, rej) => {

    console.log('\t\tsetting hash for ', userId)

    HashModel
      .findOne({userId: userId})
      .then(record => {
        console.log('\t\tfound hash record', record);

        _genrateHash(password)
          .then(hash => {
            console.log('\t\tgenerated hash', hash);

            if (record) {

              record.hash = hash;

              record.save((err) => {
                if (err) rej({status: 500, msg: 'Error processing credentials'});
                else res();
              });

            } else {

              let stagedHash = new HashModel({
                userId: userId,
                hash: hash
              });

              stagedHash.save((err) => {
                if (err) rej({status: 500, msg: 'Error processing credentials'});
                else res();
              })

            }


          })
          .catch(err => {
            rej({status: 500, msg: 'Error processing credentials'});
          });

      })
      .catch(err => {
        rej({status: 500, msg: 'Error processing credentials'});
      });  

  });

};


const clearHash = (email) => {

};

module.exports = {

  getHash: getHash,
  setHash: setHash,
  clearHash: clearHash

};