import * as axios from 'axios';
import * as localForage from 'localforage';

import { UserActions } from '../Actions/UserActions';
import { AuthActions } from '../Actions/AuthActions';
import { GroupActions } from '../Actions/GroupActions';

import { CacheService } from './CacheService';

class _UserService {

  constructor() {

    this._cacheKey = 'bundylol_user';

    // this._clearCache();
  
  } 


  // should query server for new user if cached.

  init() {

    return new Promise((res, rej) => {

      this
        ._getFromCache()
        .then(user => {
          UserActions.setUser(user);
          // GroupActions.setAll(user.memberOf);
          this
            .getUser(user.email)
            .then(user => {
              console.log('UserService -> init() -> then() | Recaching user.')
              this._cacheUser(user);
              UserActions.setUser(user);
            })
            .catch(err => {
              console.log('UserService.js -> init() | Error refreshing user')
            });
          res();
        })
        .catch(() => { res(); });
    });
  }

  _getFromCache() {
    return CacheService.get(this._cacheKey);
  }

  _cacheUser(user) {
    console.log('UserService -> _cacheUser() | Caching user:', user)
    CacheService.cache(this._cacheKey, user);
  }

  _clearCache() {
    CacheService.remove(this._cacheKey);
  }

  cacheUser(user) {
    this._cacheUser(user);
  }

  getUser(email) {
    
    return new Promise((res, rej) => {
      axios
        .get(`/user/getUser?email=${email}`)
        .then(response => {
          res(response.data.user);
        })
        .catch(err => {
          rej(err.response.data);
        });
    });
  }

  // fetchUser(email) {

  //   return new Promise(function(res, rej) {

  //     axios
  //       .get(`/user/getUser?email=${email}`)
  //       .then(response => {
  //         console.log(response.data)
  //         res(response.data.user);
  //       })
  //       .catch(err => {
  //         rej(err.response.data);
  //       });
        
  //   });

  // }

  // updateUser(user) {

  //   // simulated API Call
  //   return new Promise(function(res, rej) {
  //     // res(user);
  //     setTimeout(() => {res(user)}, Math.floor((Math.random() * (2000-500)) + 500))
  //   });

  // }

  createUser(userReq) {


      axios.post('/user/create', {
        user: userReq
      })
      .then(response => {
        console.log('got user', response.data.user);
        console.log('got token', response.data.token);
        UserActions.setUser(response.data.user);
        AuthActions.setToken(response.data.token);
      })
      .catch(err => {
        console.error(err.response.data);
      });
      
  }

}


export const UserService = new _UserService();