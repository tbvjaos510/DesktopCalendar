// import google api
import { google } from "googleapis"
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
import credential from '../../../../private/credentials.json'
import storage from 'electron-json-storage'

var oAuth2Client
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_urls } = credentials.installed
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_urls[0]);
  storage.get('auth', (err, token) => {
    if (err) return ; // TODO: 새 토큰 발급 및 저장
    
  })
}