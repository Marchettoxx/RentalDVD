const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const fs = require('fs');
const { buildSchema } = require('graphql');
const { root } = require("./queries");
const cors = require('cors');
const { json } = require('body-parser');
const { verify} = require("jsonwebtoken");
const HttpHeaders = require("express/lib/application");

const PORT = 4000;
const SK = process.env.JWT;
const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));

const app = express();
app.use(cors());
app.use(json());

const verifyUser = async (req) => {
    console.log("Sono qui")
    try{
        const token = req.headers["authorization"] || "";
        if (token == "") {
            console.log("Graphql");
            req.next();
        } else if (token == "login") {
            console.log("Login");
            req.next();
        }
        else {
            const { user } = await verify(token, SK);
            req.user = user
            console.log("Pass verifyUser: ", req.user);
            req.next();
        }
    } catch(err) {
        console.log("Error verifyUser: ", err);
    }
};

app.use(verifyUser);

app.use('/graphql', graphqlHTTP( req => ({
    rootValue: root,
    schema: schema,
    graphiql: true,
})));

app.listen(PORT, () => {
    console.log(`🚀 Running a GraphQL API server at http://localhost:${PORT}/graphql`)
})


