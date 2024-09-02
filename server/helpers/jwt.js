const { sign, verify } = require('jsonwebtoken')
// 
const JWT_SECRET = process.env.JWT_SECRET


module.exports = {
  signToken: (payload) => sign(payload, JWT_SECRET),
  verifToken: (token) => verify(token, JWT_SECRET)
}

