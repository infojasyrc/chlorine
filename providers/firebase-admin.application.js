'use strict'

const admin = require('firebase-admin')
const dotenv = require('dotenv')

const serviceAccount = require('./../services-config/app.json')

const account = { ...serviceAccount }

dotenv.config()

account.private_key_id = process.env.PRIVATE_KEY_ID
account.private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
account.client_email = process.env.CLIENT_EMAIL
account.client_id = process.env.CLIENT_ID
account.client_x509_cert_url = process.env.CLIENT_CERT_URL

let app = null

module.exports = () => {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert(account),
      databaseURL: 'https://spidernode-app.firebaseio.com',
      storageBucket: 'spider-node-app.appspot.com',
    })
  }

  return app
}
