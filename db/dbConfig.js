// require("dotenv").config();
let mysql2 = require("mysql2");

// const dbConnection = mysql2.createPool({
//     host:   "localhost",
//     user: "root",
//     password: "root",
//     database: "evangadidb",

//     connectionLimit: 10, // maximum number of connections in the pool
// });

urlDB = `mysql://root:Fh6fCdb2C4dGFe-65edFdbceeFA5FA1b@monorail.proxy.rlwy.net:43942/railway`;
const dbConnection = mysql2.createPool(urlDB);

// dbConnection.execute("select 'test' ", (err, result) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(result);
//     }
// });

module.exports = dbConnection.promise();
