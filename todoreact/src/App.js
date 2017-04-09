import React from 'react';
import Axios from 'axios';
import uuid from 'uuid/v4';
import './App.css';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      todo: ''
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  handleDelete(idx) {
    this.setState((prevState) => {
      items: prevState.items.splice(idx, 1)
    })
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
      this.setState((prevState) => ({
        items: prevState.items.concat(data)
      }))
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="wrapper">
        <h3 className="title">Todo App</h3>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChangeText} value={this.state.todo}/>
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>

        {console.log(this.state.items)}
        <TodoList onClick={this.handleDelete}  items={this.state.items} />


      </div>
    );
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul className="ultodo">
        {this.props.items.map((item, idx) =>
          <li key={item.id} className="list-item">
            {item.todo}
            <button onClick={() => this.props.onClick(idx)} className="list-span"> -</button>
          </li>
        )}
      </ul>
    );
  }
}

export default TodoApp
