import jwt from "jwt-decode";
import history from 'utils/history';
import http from 'utils/httpInstance';

class Auth {
  token: null | string;

  constructor() {
    this.token = null;
  }

  getToken(): string {
    this.token = window.localStorage.getItem('token') || '';
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', this.token);
  }

  getUser(): { name: string; username: string; id: number; } | null {
    try {
      let token = this.getToken();
      const { name, username, id } = jwt(token);
      return { name, username, id };
    } catch (err) {
      console.log('Invalid User')
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwt(token);
      return (decoded.exp < Date.now() / 1000);
    } catch (err) {
      return false;
    }
  }

  logout() {
    
  }

  // getProfile() {
  //   return jwt(this.getToken());
  // }
}

let auth = new Auth();

export default auth;