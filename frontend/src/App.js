import React from 'react'
import axios from 'axios'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {LoginComponent, RegisterComponent, HomePage, PostDetailComponent, UserDetailComponent, NavbarComponent, CreatePostComponent} from './components/index'
import {Navbar, Nav, Button} from 'react-bootstrap'

function App() {
    axios.defaults.baseURL = "http://localhost:9000/"
    console.log(localStorage.getItem("user"));

    return (
      <div className="App">
          <NavbarComponent />
          <Router>
              <Switch>
                  <Route exact path="/" render={() => <HomePage />} />
                  <Route exact path="/register" render={() => <RegisterComponent />} />
                  <Route exact path="/login" render={() => <LoginComponent />} />
                  <Route exact path="/posts/:id" render={({match}) => <PostDetailComponent id={match.params.id} />} />
                  <Route exact path="/profiles/:id" render={({match}) => <UserDetailComponent id={match.params.id}/>} />
                  <Route exact path="/create" render={() => <CreatePostComponent />} />
              </Switch>
          </Router>
      </div>
    );
}

export default App;
