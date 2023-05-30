const { db, db1 } = require("./pgAdaptor");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt} = require("graphql");
const { CustomerType, LoginType, FilmListType} = require("./types");

/*const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    type: "Query",
    fields: {
        customer: {
            type: CustomerType,
            args: {id: {type: GraphQLID}},
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
            args: {username: String, password: String},
            resolve(parentValue, args) {
                const query = `SELECT * FROM login WHERE username=$1 and password=$2`;
                const values = [args.username];

                return db1
                    .one(query, values)
                    .then(res => res)
                    .catch(err => err);
            }
        },
        films: {
            type: FilmListType,
            args: {offset: {type: GraphQLInt}},
            resolve(parentValue, args) {
                const query = `SELECT * FROM film LIMIT 10`;

                return db
                    .any(query)
                    .then(res => {res.length, res.slice()})
                    .catch(err => err);
            }
        }
    }
});
*/

const root = {
    login: (args) => {
        const query = `SELECT * FROM login WHERE username=$1 and password=$2`;
        const values = [args.username, args.password];
        return db1
            .one(query, values)
            .then(res => res)
            .catch(err => err);
    },
    films: (args) => {
        const query = `SELECT * FROM film`;
        const values = [args.offset, args.limit];
        return db1
            .one(query, values)
            .then(res => res)
            .catch(err => err);
    }
}

exports.root = root;
