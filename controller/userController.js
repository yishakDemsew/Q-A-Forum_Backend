//db connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// register function
async function register(req, res) {
    const { username, firstname, lastname, email, password } = req.body;
    if (!email || !password || !firstname || !lastname || !username) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "please provide all required informations" });
        // staus code 400= bad request
    }

    try {
        const [user] = await dbConnection.query(
            "select user_name,user_id from users where user_name=? or email=?",
            [username, email]
        );
        if (user.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ msg: "user already exist" });
        }
        if (password.length < 8) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ msg: "password must be 8 characters" });
        }

        //encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await dbConnection.query(
            "INSERT INTO users(user_name,first_name, last_name, email,password) VALUES (?,?,?,?,?)",
            [username, firstname, lastname, email, hashedPassword]
        );

        return res.status(StatusCodes.CREATED).json({ msg: "user created" });
    } catch (error) {
        console.log(error.message);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "INTERNAL_SERVER_ERROR " });
    }
}

// login function
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "please enter all required fields" });
    }
    try {
        const [user] = await dbConnection.query(
            "select user_name,user_id,password from users where email=?",
            [email]
        );
        // console.log(user.username);
        if (user.length == 0) {
            return res.status(400).json({ msg: "Invalid credential,email" });
        }
        console.log(user);
        //compare password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ msg: "invalid credential, password" });
        }

        const username = user[0].user_name;
        const userid = user[0].user_id;
        // Computing. Token, an object (in software or in hardware) which represents the right to perform some operation:
        const token = jwt.sign({ username, userid }, "secret", {
            expiresIn: "1d",
        });

        return res.status(200).json({ msg: "user login successful", token });
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ msg: "something went wrong, try again later!" });
    }
}

// The checkUser function is a protected route that requires a valid JWT to access. It uses the authMiddleware to verify the token.
async function checkUser(req, res) {
    console.log("User object from req:", req.user);
    const username = req.user.username;
    const userid = req.user.userid;
    console.log(userid);
    res.status(200).json({ msg: "valid user", username, userid });
    // res.send("check user");
}

module.exports = { register, login, checkUser };
