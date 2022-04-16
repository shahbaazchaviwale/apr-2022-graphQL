const express = require("express");
// add layer
const expressGraphQL = require("express-graphql").graphqlHTTP;
const schema = require("./schema/schema");
const app = express();
var cors = require("cors");
app.use(cors()); // prevent cors errors

// this will take care when request comes
app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Server started...");
});
