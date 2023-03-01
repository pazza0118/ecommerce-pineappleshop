import { API } from "../config";


export async function signup(user) {

  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();  // this does not turn response into json format, it parses it properly so that the dev can actually use it    
    })
    .catch(err => console.log("fetch .catch, err is ", err))    // only triggers when network error encountered (for fetch specific?)
}

export async function signin(user) {

  return fetch(`${API}/signin`, {         // remember, this "return" keyword returns the entire promise including the .then & .catch
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      console.log("fetch activated, response is ", response)
      return response.json();
    })
    .catch(err => console.log("fetch .catch, err is ", err))    // only triggers when network error encountered (for fetch specific?)
}

export function signout(redirectHome) {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");     // removes token in local storage
    redirectHome();     // 
    return fetch(`${API}/signout`, {    // asks the server to remove token in web browser
      method: "GET"
    })
      .then(response => {
        console.log("signout response is ", response);      // whatever is the response from the server
      })
      .catch(err => {
        console.log("signout catch err is ", err);
      })
  }
}



// export const authenticate = (data, next) => {
//     console.log(next)
//     if (typeof window !== "undefined") {
//         localStorage.setItem("jwt", JSON.stringify(data));         // method for storing to localStorage: localStorage.setItem("keyName", dataInJSONString)    // cannot be in JSON obj
//         //next();       // the video has next() here 
//     }
//     next();
// }
export const authenticate = (data) => { // store data (token & user info) under the name "jwt" on localStorage
  if (typeof window !== "undefined") {
    // method for storing to localStorage: 
    // localStorage.setItem("keyName", dataInJSONString)
    localStorage.setItem("jwt", JSON.stringify(data));
  }
}
export const isAuthenticated = () => {
  // console.log("isAuthenticated() triggered")
  if (typeof Window === "undefined") {
    // console.log("isAuthenticated() triggered - not on browser")
    return false;
  }
  else if (localStorage.getItem("jwt")) {
    // technically I can just say return true, but this way I can extract the jwt user token
    // console.log("Retrieving user profile & token from localStorage")
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    // console.log("isAuthenticated() triggered - nothing in localStorage")
    return false;
  }
}