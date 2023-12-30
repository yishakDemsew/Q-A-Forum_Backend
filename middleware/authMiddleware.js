const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ msg: "Authentication invalid" });
    }
    if (!authHeader) {
        return res.status(401).json({ msg: "Authentication invalid" });
    }
    const token = authHeader.split(" ")[1];
    console.log(authHeader);
    console.log(token);
    try {
        const { username, userid } = jwt.verify(token, "secret");
        console.log("Decoded user:", username, userid);
        req.user = { username, userid };
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ msg: "Authentication invalid2" });
    }
}

// async function authMiddleware(req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//         return res.status(401).json({ msg: "Authentication invalid" });
//     }

//     const token = authHeader.split(" ")[1];
//     console.log("Received token:", token);

//     try {
//         const decoded = jwt.verify(token, "secret");
//         console.log("Decoded user:", decoded);

//         const { user_name, user_id } = decoded;
//         req.user = { user_name, user_id };
//         next();
//     } catch (error) {
//         console.error("Authentication error:", error);
//         return res.status(401).json({ msg: "Authentication invalid2" });
//     }
// }

module.exports = authMiddleware;

// module.exports = authMiddleware;
