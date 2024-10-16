const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const fs = require('fs');
const { buildSchema } = require('graphql');
const { root } = require("./queries");
const cors = require('cors');
const { json } = require('body-parser');
const { verify} = require("jsonwebtoken");

const PORT = 4000;
const SK = process.env.JWT;
const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));

const app = express();
app.use(cors());
app.use(json());

const verifyUser = async (req) => {
    try{
        const token = req.headers["authorization"] || "GRAPHQL";
        if (token === "GRAPHQL") {
            console.log("GRAPHQL");
        } else if (token === "NO_TOKEN") {
            console.log("NO_TOKEN");
        } else if (token === "LOGIN"){
            console.log("LOGIN");
        } else {
            const { user } = await verify(token, SK);
            req.user = user;
        }
    } catch(err) {
        console.log("Error verifyUser: ", err);
    }
    req.next();
};

app.use(verifyUser);

app.use('/graphql', graphqlHTTP( req => ({
    rootValue: root,
    schema: schema,
    graphiql: true,
    context: {
        SK,
        user: req.user
    }
})));

app.listen(PORT, () => {
    console.log(`🚀 Running a GraphQL API server at http://localhost:${PORT}/graphql`)
})


