const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const mongoose = require('mongoose');

const port = 3001;

/**
 * Create Mongoose schema 
 */
const TODO = mongoose.model('Todo', new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String
}));


mongoose.connect('mongodb://localhost/todo', (err) => {
  err ? console.error(error) : console.log('db connected');
});


const TodoType = new GraphQLObjectType({
  name: 'todo',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'id of todo list'
    },
    title: {
      type: GraphQLString,
      description: 'Task title'
    }
  })
})

const promiseList = () => {
  return new Promise((resolve, reject) => {
    TODO.find((err, todos) => {
      err ? reject(err) : resolve(todos);
    })
  })
}

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => {
        return promiseList();
      }
    }
  })
})

const MutationAdd = {
  type: TodoType,
  description: 'Add a Todo',
  args: {
    title: {
      name: 'title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    const newTodo = new TODO({
      title: args.title
    })
    newTodo.id = newTodo._id
    return new Promise((resolve, reject) => {
      newTodo.save((err) => {
        err ? reject(err) : resolve(newTodo);
      })
    })
  }
}

const MutationDelete = {
  type: TodoType,
  description: 'Delete todo list',
  args: {
    id: {
      title: 'Id todo list',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err)
        } else if (!todo) {
          reject('Todo NOT found')
        } else {
          todo.remove((err) => {
            err ? reject(err) : resolve(todo);
          })
        }
      })
    })
  }
}

const MutationEdit = {
  type: TodoType,
  description: 'Edit todo list',
  args: {
    id: {
      title: 'id of todo list',
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      name: 'title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      TODO.findById(args.id, (err, todo) => {
        if (err) {
          reject(err);
          return;
        }

        if (!todo) {
          reject('Todo Not found');
          return;
        }

        todo.title = args.title
        todo.save((err) => {
          err ? reject(err) : resolve(todo);
        })
      })
    })
  }
}

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    delete: MutationDelete,
    edit: MutationEdit
  }
})

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});

const app = express();
app.use('/', graphqlHTTP((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  return {
    schema: schema,
    graphiql: true,
    pretty: true
  }
}));
app.listen(`${port}`);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
