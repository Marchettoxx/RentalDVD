const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const graphql = require("graphql");
const { GraphQLSchema } = graphql;
const { query} = require("./queries");
const cors = require('cors');
const { json } = require('body-parser');

const PORT = 4000
const app = express();
app.use(cors());
app.use(json());

const schema = new GraphQLSchema({
    query
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(PORT, () => {
    console.log(`🚀Running a GraphQL API server at http://localhost:${PORT}/graphql`)
})


