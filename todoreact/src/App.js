import React from 'react';
import Axios from 'axios';
import uuid from 'uuid/v4';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      todo: ''
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


    onChangeText(e) {
      this.setState({todo: e.target.value});
    }

    handleSubmit(e) {
      e.preventDefault();
      var newItem = {
        todo: this.state.todo,
        id: uuid()
      };
      this.setState((prevState) => ({
        items: prevState.items.concat(newItem),
        todo: ''
      }));
    }

  componentDidMount() {
    Axios({
      method: 'get',
      url: 'http://localhost:3001/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        query: "{todos { id todo }}"
      }
    })
    .then((response) => {
      const data = Array.from(response.data.data.todos)
      console.log(data)
      this.setState((prevState) => ({
        items: prevState.items.concat(data)
      }))
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <h3>Todo App</h3>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChangeText} value={this.state.todo}/>
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>

        {console.log(this.state.items)}
        <TodoList items={this.state.items} />


      </div>
    );
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item =>
          <li key={item.id}>{item.todo}</li>
        )}
      </ul>
    );
  }
}

export default TodoApp
