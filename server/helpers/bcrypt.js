const {compareSync, hashSync} = require('bcryptjs');


function hashPassword(password) {
    let hash = hashSync(password)
    return hash
}

function comparePassword(password, passwordDb) {
    let compare = compareSync(password, passwordDb)
    return compare
}

module.exports = {hashPassword, comparePassword}