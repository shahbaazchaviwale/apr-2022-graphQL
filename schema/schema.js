const { default: axios } = require("axios");
const res = require("express/lib/response");
const graphql = require("graphql");
// const _ = require('lodash');
// No.  1- this returns types which u used in defination
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

//setup object fields with types
// No.  6
const companyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentType, args) {
        return axios
          .get(`http://localhost:5000/companies/${parentType.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

// No.  2
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    // make this closure
    id: { type: graphql.GraphQLString },
    firstName: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    company: {
      type: companyType,
      resolve(parentValue, args) {
        // find the company details based on ID  with user associate
        return axios
          .get(`http://localhost:5000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
        /**
         * parentValue >> { id: '11', firstName: 'Yalli', age: 20, companyId: '1' }
         * args >> {}
         */
      },
    },
  }),
});

// No.  4 -create an array
// const users = [
//     { id: '23', firstName: 'Yalli', age: 20},
//     { id: '47', firstName: 'Balli', age: 30}
// ]
// No.  3 - the purpos of rootQuery is to allow graphQL to jump and land on specific node to get data
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:5000/users/${args.id}`)
          .then((res) => res.data);
      },
    },
    company: {
      type: companyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:5000/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
    // get users list then use this code " type: new GraphQLList(Your_Type)"
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
    
        return axios
          .get(`http://localhost:5000/users/`)
          .then((res) => res.data);
      }
    }
  },
});

// No. 7
// mutattion is like adding , updating, deleting records
const mutationDB = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        // its an empty validatin check GraphQLNonNull , when use in grapghQL is ask some
        // compulsary args
        firstName: { type: new graphql.GraphQLNonNull(GraphQLString) },
        age: { type: new graphql.GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentType, { firstName, age, companyId }) {
        return axios
          .post("http://localhost:5000/users", { firstName, age, companyId })
          .then((res) => res.data);
      },
    },

    deleteUser: {
      type: UserType,
      args: {
        id: { type: new graphql.GraphQLNonNull(GraphQLString) },
      },
      resolve(parentType, { id }) {
        return axios
          .delete(`http://localhost:5000/users/${id}`)
          .then((res) => res.data);
      },
    },

    editUser: {
      type: UserType,
      args: {
        id: { type: new graphql.GraphQLNonNull(GraphQLString) },
        firstName: { type: new graphql.GraphQLNonNull(GraphQLString) },
        age: {type: GraphQLInt},
        companyId: {type: GraphQLString}
      },
      resolve(parentType, args){
      /**
       * "PATCH" update the specific property from db
       * in URL you are passing args.id, next argument is args which comes like
       * {args.id, args.firstName, args.age,  args.companyId} but GRAPHQL wont allow t update id property
       * it will ignore the 
       */
  
        return axios.patch(`http://localhost:5000/users/${args.id}`,args)
        .then(res => res.data)
      }
    },
  },
});
// No.  5 add schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutationDB,
});
