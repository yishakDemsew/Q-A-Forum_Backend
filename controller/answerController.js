const dbConnection = require("../db/dbConfig");

// post answer
const post_answer = async (req, res) => {
    const { answer } = req.body;
    console.log("ansewers", answer);
    console.log("Answer length:", answer.length);

    // const question_id = req.params.questionid;
    // const userid = req.user.userid;
    // console.log(question_id);

    const questionId = req.params.questionid; // Change to questionId
    const userId = req.user.userid;
    console.log("QuestionId:", questionId);

    if (!answer) {
        return res.status(300).json({ msg: "provide answer field" });
        // (custom status, not standard HTTP) i.e, though 300 is not a standard HTTP status code;it might be a custom code in your application
    }
    try {
        await dbConnection.query(
            "INSERT INTO answers (question_id, user_id, answer  ) value(?,?,?)",
            [questionId, userId, answer]
        );

        return res.status(200).json({ msg: "Answer posted successfully" });
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ msg: "something went to wrong try again later" });
        // In case of an error during the database operation, it catches the error.
    }
};

// get answer
const get_answer = async (req, res) => {
    // const answerId = req.params.answerid;
    // console.log("Received request for answers of answerId:", answerId);
    // const questionId = req.params.questionid;
    // Change from answerid to questionid
    // console.log("Received request for answers of questionId:", questionId);
    //
    const questionId = req.params.questionid;
    console.log("Received request for answers of questionId:", questionId);

    try {
        let [allAnswer] = await dbConnection.query(
            `SELECT a.answer, u.user_name FROM answers a INNER JOIN users u ON a.user_id = u.user_id
WHERE a.question_id  = ?`,
            [questionId]
        );
        return res.status(200).json({ allAnswer });
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ msg: "something went to wrong try again later" });
    }
};

module.exports = { post_answer, get_answer };

// const DbConection = require("../db/dbConfige");
// const uuid=require("uuid");
// //post answer
// const post_answer = async (req, res) => {
//   const { answer } = req.body;
//   // const userid = req.params.questionid;
//   const { userid } = req.user;
//   // console.log(question_id);
//   if (!answer) {
//     return res.status(400).json({msg:'provide answer field'})
//   }
//   try {
//     const answer_id=uuid.v4();

//     await DbConection.query('INSERT INTO answer(questionid,userid, answer  ) value(?,?,?)',[ answer_id, userid, answer,])

//     return res.status(200).json({msg:'Answer posted successfully'})
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ msg: "something went to wrong try again later" });
//   }
// };
// const get_answer = async (req, res) => {
// 	const answer_id = req.params.answerid;
//   console.log(answer_id)

// 	try {
// 		let [allAnswer] = await dbConnection.query(
// 			`SELECT answers_.answer, users_.username FROM answers_ INNER JOIN users_ ON answers_.user_id = users_.userid
// WHERE answers_.question_id = ?`,
// 			[question_id]
// 		);
// 		return res.status(200).json({ allAnswer });
// 	} catch (error) {
// 		console.log(error.message);
// 		return res
// 			.status(500)
// 			.json({ msg: "something went to wrong try again later" });
// 	}
// };

// module.exports = { post_answer, get_answer };
