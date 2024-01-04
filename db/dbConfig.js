// require("dotenv").config();
// let mysql2 = require("mysql2");

// const dbConnection = mysql2.createPool(process.env.urlDB);

// // SQL commands for creating tables
// const createTables = [
//     `CREATE TABLE if not exists users(
//         user_id int auto_increment not null,
//         user_name varchar(20) not null,
//         first_name varchar(20) not null,
//         last_name varchar(20) not null,
//         email varchar(40) not null,
//         password varchar(100) not null,
//         PRIMARY KEY (user_id)
//     );`,
//     `CREATE TABLE if not exists questions(
//         id int not null auto_increment,
//         question_id varchar(100) not null unique,
//         user_id int not null,
//         title varchar(200) not null,
//         description varchar(200) not null,
//         tag varchar(20),
//         PRIMARY KEY (id, question_id),
//         FOREIGN KEY (user_id) REFERENCES users(user_id)
//     );`,
//     `CREATE TABLE if not exists answers(
//         answer_id int auto_increment not null,
//         user_id int not null,
//         question_id varchar(200) not null,
//         answer varchar(200) not null,
//         PRIMARY KEY (answer_id),
//         FOREIGN KEY (user_id) REFERENCES users(user_id),
//         FOREIGN KEY (question_id) REFERENCES questions(question_id)
//     );`,
//     `ALTER TABLE answers MODIFY COLUMN answer VARCHAR(500);`,
// ];

// // Execute the SQL commands individually
// createTables.forEach((sql) => {
//     dbConnection.query(sql, (err, results) => {
//         if (err) {
//             console.error("Error creating tables:", err);
//         } else {
//             console.log("Tables created successfully:", results);
//         }
//     });
// });

// module.exports = dbConnection.promise();

require("dotenv").config();
let mysql2 = require("mysql2");
const dbConnection = mysql2.createPool(process.env.DB_URL);

const users = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT NOT NULL,
        user_name VARCHAR(20) NOT NULL,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL,
        password VARCHAR(100) NOT NULL,
        PRIMARY KEY (user_id)
    )
`;

dbConnection.query(users, (err, result) => {
    if (err) {
        throw err;
    }
    console.log("Users table created successfully.");
});

const questions = `
    CREATE TABLE IF NOT EXISTS questions (
        id INT NOT NULL AUTO_INCREMENT,
        question_id VARCHAR(100) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description VARCHAR(200) NOT NULL,
        tag VARCHAR(20),
        PRIMARY KEY (id, question_id)
   
    )
`;

dbConnection.query(questions, (err, result) => {
    if (err) {
        throw err;
    }
    console.log("Questions table created successfully.");
});

const answer = `
    CREATE TABLE IF NOT EXISTS answers (
        answer_id INT AUTO_INCREMENT NOT NULL,
        user_id INT NOT NULL,
        question_id VARCHAR(200) NOT NULL,
        answer VARCHAR(200) NOT NULL,    
        PRIMARY KEY (answer_id)
     
    )
`;

dbConnection.query(answer, (err, result) => {
    if (err) {
        throw err;
    }
    console.log("Answer table created successfully.");
});

module.exports = dbConnection.promise();
