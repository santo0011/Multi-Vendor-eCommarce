const jwt = require('jsonwebtoken');


// createToken
module.exports.createToken = async (data) => {
    const token = await jwt.sign(data, process.env.SECRET, { expiresIn: "7d" });
    return token;
}
