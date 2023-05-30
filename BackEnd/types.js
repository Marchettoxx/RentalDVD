/*const graphql = require("graphql");
const {GraphQLInt, GraphQLList} = require("graphql");
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

const FilmType = new GraphQLObjectType({
    name: "Film",
    type: "Query",
    fields: {
        film_id: {type: GraphQLInt},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        release_year: {type: GraphQLString},
        language_id: {type: GraphQLInt},
        rental_duration: {type: GraphQLString},
        rental_rate: {type: GraphQLString},
        length: {type: GraphQLString},
        replacement_cost: {type: GraphQLString},
        rating: {type: GraphQLString},
        last_update: {type: GraphQLString},
        special_features: {type: GraphQLString},
        fulltext: {type: GraphQLString}
    }
});

const FilmListType = new GraphQLList({
    name: "Films",
    type: "Query",
    fields: {
        count: {type: GraphQLInt},
        films: {type: GraphQLList(FilmType)}
    }
});

exports.CustomerType = CustomerType;
exports.LoginType = LoginType;
exports.FilmListType = FilmListType;
*/
