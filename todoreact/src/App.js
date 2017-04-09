import React from 'react';
import Axios from 'axios';
import './App.css';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      title: ''
    };

    this.ENDPOINT = 'http://localhost:3001/';
    this.onChangeText = this.onChangeText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }


    onChangeText(e) {
      this.setState({title: e.target.value});
    }

    serverRequest(httpVerb, queryString) {
      return Axios({
        method: `${httpVerb}`,
        url: `${this.ENDPOINT}`,
        headers: {
          'Content-Type': `application/graphql`
        },
        params: {
         query: `${queryString}`
        }
      })
    }

    handleSubmit(e) {
      e.preventDefault();
      this.serverRequest(`post`, `mutation{ add (title: "${this.state.title}") { id, title } }`)
      .then((response) => {
        this.setState((prevState) => ({
          items: prevState.items.concat(response.data.data.add),
          title: ''
        }));
      })
      .catch(err => console.log(err))
    }

  handleDelete(itemid, idx) {
    this.serverRequest(`post`, `mutation { delete(id: "${itemid}") { id, title } }`)
    .then((response) => {
      response.status == 200 
      ? this.setState((prevState) => {
          items: prevState.items.splice(idx, 1)
        })
      : console.log('Not Found');
    })
    .catch(err => console.log(err))
  }

  componentDidMount() {
    this.serverRequest(`get`, `{todos { id, title }}`)
      .then((response) => {
        const data = Array.from(response.data.data.todos)
        this.setState((prevState) => ({
          items: prevState.items.concat(data)
        }));
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="wrapper">
        <h3 className="title">Todo App</h3>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChangeText} value={this.state.title}/>
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>

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
            {item.title}
            <button onClick={() => this.props.onClick(item.id, idx)} className="list-span"> -</button>
          </li>
        )}
      </ul>
    );
  }
}

export default TodoApp
