const graphql = require("graphql");
const {GraphQLInt} = require("graphql");
const { GraphQLObjectType, GraphQLString } = graphql;

const CustomerType = new GraphQLObjectType({
    name: "Customer",
    type: "Query",
    fields: {
        customer_id: {type: GraphQLString},
        store_id: {type: GraphQLString},
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        email: {type: GraphQLString},
        address_id: {type: GraphQLString},
        activebool: {type: GraphQLString},
        create_date: {type: GraphQLString},
    }
});

const LoginType = new GraphQLObjectType({
    name: "Login",
    type: "Query",
    fields: {
        customer_id: {type: GraphQLInt},
        username: {type: GraphQLString},
        password: {type: GraphQLString},
    }
});

exports.CustomerType = CustomerType;
exports.LoginType = LoginType;
