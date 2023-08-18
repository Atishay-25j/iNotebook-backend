const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = async (req, res, next) => {
    // Get the user from the jwt token and add id to the req object

    const token = req.header("auth-token")
    console.log("token");
    console.log(token);
    console.log(!token);
    if (!token) {
        console.log("Not token", token);
        console.log(!token);
        // res.status(401).send({ error: "Please authenticate using a valid token not present" });
    }
    try {
        console.log("try");
        const data = await jwt.verify(
            token,
            JWT_SECRET,
            (err, verified) => {
                if (err) {
                    console.log("In verify", err);
                }
                console.log(verified, "in verified")
                console.log(verified.user);
                req.user = verified.user;
                console.log(req.user);
                console.log("Next");
                next()
            }
        );;

    }
    catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token catch" });
    }

}
module.exports = fetchuser