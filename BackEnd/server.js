const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const graphql = require("graphql");
const fs = require('fs');
const { buildSchema } = require('graphql');
const { GraphQLSchema } = graphql;
const { root } = require("./queries");
const cors = require('cors');
const { json } = require('body-parser');

const PORT = 4000
const app = express();
app.use(cors());
app.use(json());

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));

app.use('/graphql', graphqlHTTP({
    rootValue: root,
    schema: schema,
    graphiql: true
}));
app.listen(PORT, () => {
    console.log(`🚀 Running a GraphQL API server at http://localhost:${PORT}/graphql`)
})


