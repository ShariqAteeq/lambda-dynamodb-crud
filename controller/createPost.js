const { v4: uuidv4 } = require("uuid");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const postsTable = process.env.POSTS_TABLE;

const createPost = (event, context, callback, response) => {
  const reqBody = JSON.parse(event.body);

  if (
    !reqBody.title ||
    reqBody.title.trim() === "" ||
    !reqBody.body ||
    reqBody.body.trim() === ""
  ) {
    return callback(
      null,
      response(400, { error: "Title and Body are required!" })
    );
  }

  const post = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body,
  };

  return db
    .put({
      TableName: postsTable,
      Item: post,
    })
    .promise()
    .then(() => {
      callback(null, response(201, post));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

module.exports = { createPost };
