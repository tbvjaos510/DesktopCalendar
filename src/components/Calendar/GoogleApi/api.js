// import google api
import credentials from "@/private/credentials.json";
import { remote } from "electron";
import fs from "fs";
import { google } from "googleapis";

// import 'google-auth-library'
// import { OAuth2Client } from 'google-auth-library'

const TOKEN_PATH = window.appdata + "/token.json";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
];
var APIKEY = null;
let Popup;
/**
 * code로 토큰을 만듭니다.
 * @param {string} code 코드
 */
function createToken(client, code, callback) {
  client.getToken(code, (err, token) => {
    if (err) return console.error("Error Create Token", err);
    client.setCredentials(token);
    console.log(TOKEN_PATH);
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) return console.error(err);
      // console.log('token success stored')
      APIKEY = token.access_token;
      callback(APIKEY);
    });
  });
}

/**
 * 토큰을 발급합니다.
 */
function getAccessToken(client, callback) {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  // console.log('Auth in authUrl', authUrl)
  Popup = new remote.BrowserWindow({ transparent: false, frame: true });
  Popup.setIgnoreMouseEvents(false);
  Popup.setMenuBarVisibility(false);
  Popup.loadURL(authUrl);
  window.Popup = Popup;
  Popup.on("closed", () => {
    Popup = null;
  });
  Popup.on("page-title-updated", (e, t) => {
    if (t.indexOf("Success code=") !== -1) {
      createToken(client, t.split("Success code=")[1], callback);
      Popup.close();
    }
  });
}
function RefreshToken(client, callback) {
  client.refreshAccessToken((err, data) => {
    if (err) return console.error(err);
    fs.writeFile(TOKEN_PATH, JSON.stringify(data), err => {
      if (err) return console.error(err);
      APIKEY = data.access_token;
      if (callback) callback(APIKEY);
    });
  });
}
var axios;
export default {
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(callback) {
    const { clientsecret, clientid, redirecturis } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      clientid,
      clientsecret,
      redirecturis[0]
    );
    // Check if we have previously stored a token.r
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err || !token) return getAccessToken(oAuth2Client, callback);
      token = JSON.parse(token);
      oAuth2Client.setCredentials(token);
      APIKEY = token.access_token;
      setInterval(() => {
        RefreshToken(oAuth2Client);
      }, 50 * 60 * 1000);
      if (token.expiry_date <= new Date()) {
        RefreshToken(oAuth2Client, callback);
      } else callback(APIKEY);
    });
  },
  setAxios(axi) {
    axios = axi;
  },
  APIKEY() {
    return APIKEY;
  },
  request(url, callback) {
    axios
      .get(url)
      .then(callback)
      .catch(err => {
        if (err) callback(null);
      });
  },
  colors(callback) {
    this.request("https://www.googleapis.com/calendar/v3/colors", callback);
  },
  calendarList(callback) {
    this.request(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList?showHidden=true",
      callback
    );
  },
  events(id, start, end, callback) {
    this.request(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        id
      )}/events?timeMin=${start.format(
        "YYYY-MM-DD[T]HH:mm:ss[Z]"
      )}&timeMax=${end.format("YYYY-MM-DD[T]HH:mm:ss[Z]")}&timeZone=Asia/Seoul`,
      callback
    );
  },
  deleteEvent(oid, id, cb) {
    // console.log(oid, id)
    axios
      .delete(
        `https://www.googleapis.com/calendar/v3/calendars/${oid}/events/${id}`
      )
      .then(req => {
        cb(req);
      })
      .catch(err => {
        console.log(err);
        cb(null);
      });
  },
  insertEvent(calendarid, timeType, start, end, title, content, colorid, cb) {
    let sendObject = {
      summary: title,
      description: content,
      colorId: colorid
    };
    if (!timeType) {
      sendObject.start = {
        dateTime: start
      };
      sendObject.end = {
        dateTime: end
      };
    } else {
      sendObject.start = {
        date: start.split("T")[0]
      };
      sendObject.end = {
        date: end.split("T")[0]
      };
    }
    axios
      .post(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarid}/events`,
        sendObject
      )
      .then(req => {
        // console.log(req)
        cb(req.data);
      })
      .catch(err => {
        // console.log(err)
        cb(null, err);
      });
  }
};
