import { Kinvey } from 'kinvey-nativescript-sdk';

export class BackendService {
  static isLoggedIn(): boolean {
    return !!Kinvey.User.getActiveUser();
  }
}
