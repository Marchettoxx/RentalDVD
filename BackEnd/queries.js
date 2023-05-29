const { db, db1 } = require("./pgAdaptor");
const { GraphQLObjectType, GraphQLID, GraphQLString} = require("graphql");
const { CustomerType, LoginType} = require("./types");

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    type: "Query",
    fields: {
        customer: {
            type: CustomerType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, args) {
                const query = `SELECT * FROM customer WHERE customer_id=$1`;
                const values = [args.id];

                return db
                    .one(query, values)
                    .then(res => res)
                    .catch(err => err);
            }
        },
        login: {
            type: LoginType,
            args: { username: { type: GraphQLString } },
            resolve(parentValue, args) {
                const query = `SELECT * FROM login WHERE username=$1`;
                const values = [args.username];

                return db1
                    .one(query, values)
                    .then(res => res)
                    .catch(err => err);
            }
        }
    }
});

exports.query = RootQuery;
