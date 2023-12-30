const dbConnection = require("../db/dbConfig");

const postQuestions = async (req, res) => {
    // Check if request body or required fields are missing
    if (!req.body || !req.body.title || !req.body.description) {
        return res
            .status(400)
            .json({ error: "Missing or incomplete data in the request body." });
    }

    // Destructure request body and extract title, description, and tag
    const { title, description, tag } = req.body;

    // Destructure the userid from the req.user object, which is set by the authentication middleware
    const { userid } = req.user;

    // Generate a unique questionid using a combination of timestamp and a random number
    const timestamp = Date.now();
    console.log("data now ", Date.now());
    const randomId = Math.floor(Math.random() * 1000);
    console.log(
        "math floor and random number",
        Math.floor(Math.random() * 1000)
        //generates a random floating-point number between 0 (inclusive) and 1 (exclusive), and then multiplies it by 1000.
        //   [0, 1000)
    );
    const questionid = `${timestamp}${randomId}`;
    console.log(questionid);

    try {
        // Check if a question with the same title and description already exists
        const [existingQuestion] = await dbConnection.query(
            "SELECT title, description FROM questions WHERE title = ? AND description = ?",
            [title, description]
        );
        // The use of [existingQuestion] is a shorthand for extracting the first element of the array returned by dbConnection.query. It's equivalent to doing something like const resultArray = await dbConnection.query(...); const existingQuestion = resultArray[0];.
        // the 'existingQuestion' itself is an array,like [[],[]]
        // The assumption here is that the query is designed to return either zero or one row from the database. If no matching question is found, existingQuestion will be an empty array ([]). If a matching question is found, existingQuestion will be an array containing the details of that question.

        // If a similar question exists, return a 409 conflict response
        if (existingQuestion.length > 0) {
            console.log(existingQuestion);
            return res.status(400).json({ existingQuestion });
            // .json({ error: "A similar question already exists" });
        }

        // Check if the description is not empty/or less character than 10
        if (description.length <= 10) {
            return res
                .status(400)
                .json({ error: "Description cannot be empty" });
        }

        // Insert the new question into the database with the generated questionid, title, description, userid, and tag
        await dbConnection.query(
            "INSERT INTO questions (question_id, title, description, user_id, tag) VALUES (?, ?, ?, ?, ?)",
            [questionid, title, description, userid, tag]
        );

        // Return a 201 created response if the question is successfully inserted
        return res.status(201).json({ msg: "Question submitted" });
    } catch (error) {
        // Log and return a 500 internal server error response if an error occurs
        console.log(error.message);
        res.status(500).json({
            error: "Something went wrong, please try again",
            //  500 Internal Server Error response
        });
    }
};

async function allQuestions(req, res) {
    try {
        const [allQuestion] = await dbConnection.query(
            `SELECT q.question_id, q.title, u.user_name FROM questions q JOIN users u ON q.user_id = u.user_id  ORDER BY id DESC;`
            // The use of aliases (q = for question and u = for users) makes the query more readable and helps avoid ambiguity when referencing columns from multiple tables.
        );
        // console.log(allQuestion);
        console.log(allQuestion);
        return res.status(200).json({ allQuestion });
    } catch (error) {
        // Log and return a 500 internal server error response if an error occurs
        console.log(error.message);
        res.status(500).json({ msg: "Something went wrong, please try again" });
    }
}

async function singleQuestion(req, res) {
    const questionId = req.params.questionid;
    console.log("questionId", questionId);
    //check if the question id is provided by the user
    if (!req.params.questionid) {
        return res.status(400).json({ msg: "single question id not provided" });
    }

    try {
        //query to the database to select the question
        const [oneQuestion] = await dbConnection.query(
            "SELECT * FROM questions WHERE question_id = ?",
            [questionId]
        );
        console.log(oneQuestion);

        //check if the provided question id is not in the database
        if (oneQuestion.length == 0) {
            return res
                .status(400)
                .json({ msg: "question not found with the provided id" });
        } else {
            //if the provided question id is exist on the database return the data
            // console.log(oneQuestion);
            res.send({ oneQuestion });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Something went wrong, please try again" });
    }
}

module.exports = { postQuestions, allQuestions, singleQuestion };

// async function allQuestions(req, res) {
// 	const { search } = req.headers;

// 	console.log(search);
// 	try {
// 		//serach question
// 		if(search){
// 			console.log("searched");
// 			let [serachQuestions] = await dbConnection.query(
// 				"SELECT * FROM questions WHERE title LIKE  concat('%' , ?, '%')",
// 				[search]
// 			);
// 			// console.log("serach questions",serachQuestions);
// 		return res.status(200).json({ serachQuestions });
// 	}

// 		//query username and all questions from the users and questions table
// 		console.log("all questions");
// 		let [allQuestion] = await dbConnection.query(
// 			`SELECT q.questionid, q.title, u.username FROM questions_ q JOIN users_ u ON q.user_id = u.userid  ORDER BY id DESC;`
// 		);
// 		return res.status(200).json({ allQuestion });
// 	} catch (error) {
// 		// Log and return a 500 internal server error response if an error occurs
// 		console.log(error.message);
// 		res.status(500).json({ msg: "Something went wrong, please try again" });
// 	}
// }

// const dbConnection = require("../db/dbConfige");
// const uuid=require("uuid");

// // post question controller
// async function postQuestions(req, res) {
//   const { title, description, tag } = req.body;

//   if (!title || !description || !tag) {
//     return res.status(400).json({ msg: "Please provide all information" });
//   }

//   try {
//     const userid = req.user.userid;
//     const questionid = uuid.v4();
//     // console.log(questionid);

//     await dbConnection.query(
//       "INSERT INTO questions (questionid, title, description, tag, userid) VALUES (?, ?, ?, ?, ?)",
//       [questionid, title, description, tag, userid]
//     );
//     return res
//       .status(201)
//       .json({ msg: "Question posted successfully" });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(400)
//       .json({ msg: "Something wents wrong, please try again later" });
//   }
// }

// // all question controller
// async function allQuestions(req, res) {
// 	try {
// 		const [allQuestion] = await dbConnection.query(
// 			`SELECT q.questionid, q.title, u.username FROM questions q JOIN users u ON q.userid = u.userid  ORDER BY id DESC;`
// 		);
// 		// console.log(allQuestion);
// 		return res.status(200).json({ allQuestion });
// 	} catch (error) {
// 		// Log and return a 500 internal server error response if an error occurs
// 		console.log(error.message);
// 		res.status(500).json({ msg: "Something went wrong, please try again" });
// 	}
// }

// // single question controller
// async function singleQuestion(req, res) {
// 	const questionId = req.params.questionid;

// 	//check if the question id is provided by the user
// 	if (!req.params.questionid) {
// 		return res.status(400).json({ msg: "single question id not provided" });
// 	}

// 	try {
// 		//query to the database to select the question
// 		const [oneQuestion] = await dbConnection.query(
// 			"SELECT * FROM questions WHERE userid = ?",
// 			[questionId]
// 		);
// 		console.log(questionId)
// 		console.log(oneQuestion.length);
// 		//check if the provided question id is not in the database
// 		if (oneQuestion.length == 0) {
// 			return res
// 				.status(400)
// 				.json({ msg: "question not found with the provided id" });

// 		} else {
// 			//if the provided question id is exist on the database return the data
// 			res.send({ oneQuestion });
// 		}
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ msg: "Something went wrong, please try again" });
// 	}
// }

// module.exports = { postQuestions, allQuestions, singleQuestion };
