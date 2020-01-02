class Auth {
  token: null | string;

  constructor() {
    this.token = null;
  }

  getToken() {
    this.token = window.localStorage.getItem('token');
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', this.token);
  }
}

let auth = new Auth();
auth.getToken()

export default auth;