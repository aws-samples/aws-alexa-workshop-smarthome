const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const https = require('https');
const config = require('./config.json');

const pems = [];

/**
 * Decode the token, and return payload
 * @param token token string
 * @returns {Object} payload
 */
async function decodeToken(token) {

  if (pems.length === 0) {
    const body = await getJWKs();
    const keys = body['keys'];
    for (let i = 0; i < keys.length; i++) {
      //Convert each key to PEM
      const key_id = keys[i].kid;
      const modulus = keys[i].n;
      const exponent = keys[i].e;
      const key_type = keys[i].kty;
      const jwk = {kty: key_type, n: modulus, e: exponent};
      pems[key_id] = jwkToPem(jwk);
    }
  }

  const decodedJwt = jwt.decode(token, {complete: true});

  if (!decodedJwt) {
    return new Error("Not a valid JWT token")
  }
  const kid = decodedJwt.header.kid;
  const pem = pems[kid];

  return jwt.verify(token, pem)
}

/**
 * Download the JWKs.
 * @returns {Promise<void>}
 */
async function getJWKs() {

  let options = {
    hostname: `cognito-idp.${config.region}.amazonaws.com`,
    port: 443,
    path: `/${config.userPoolId}/.well-known/jwks.json`,
    headers: { 'Content-Type': 'application/json' }
  };

  return new Promise(((resolve, reject) => {
    const req = https.request(options, (res) => {
      let json_string = "";
      res.setEncoding('utf8');
      res.on('data', (data) => {
        json_string += data;
      });

      res.on('end', () => {
        resolve(JSON.parse(json_string))
      });

      req.on('error', (e) => {
        reject(e)
      });

    });

    req.end();
  }));
}


module.exports = {
  decodeToken: decodeToken
};
