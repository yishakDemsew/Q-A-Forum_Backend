let mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "evangadidb",

    connectionLimit: 10, // maximum number of connections in the pool
});

// dbConnection.execute("select 'test' ", (err, result) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(result);
//     }
// });

module.exports = dbConnection.promise();
