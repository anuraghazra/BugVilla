import jwt from "jwt-decode";

class Auth {
  token: null | string;

  constructor() {
    this.token = null;
  }

  getToken(): string | null {
    this.token = window.localStorage.getItem('token');
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', this.token);
  }

  getUser(): object | null {
    try {
      let token = auth.getToken();
      const user = jwt(token);
      return user;
    } catch (err) {
      console.log('Invalid User')
      return null;
    }
  }


  fetch(url: string, options: any) {
    // performs api calls sending the required authentication headers
    const headers: any = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
  }

  _checkStatus(response: any) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      var error: any = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  login(username: string, password: string) {
    // Get a token from api server using the fetch api
    return this.fetch(`/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => {
      this.setToken(res.token) // Setting the token in localStorage
      return Promise.resolve(res);
    })
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token) // handwaiving here
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwt(token);
      if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
        return true;
      }
      else
        return false;
    }
    catch (err) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  getProfile() {
    return jwt(this.getToken());
  }
}

let auth = new Auth();

export default auth;