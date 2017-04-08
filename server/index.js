const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const uuid = require('uuid/v4')
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type People {
    id: String
    todo: String
  }

  type Query {
    todos: [People]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  todos: () => {
    return [
      {id: uuid(), todo: 'minum'},
      {id: uuid(), todo: 'makan'},
      {id: uuid(), todo: 'belanja'}
    ];
  },
};

const app = express();
app.use('/graphql', graphqlHTTP((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  return {
    schema: schema,
    rootValue: root,
    graphiql: true,
  }
}));
app.listen(3001);
console.log('Running a GraphQL API server at localhost:3001/graphql');
