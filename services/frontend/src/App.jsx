import React, {Component} from "react";
import axios from "axios";
import {Route, Switch} from 'react-router-dom';
import Modal from 'react-modal';

import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";
import About from './components/About';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserStatus from './components/UserStatus';
import Message from './components/Message';

const modalStyles = {
  content: {
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    border: 0,
    background:'transparent'
  }
};

Modal.setAppElement(document.getElementById("root"));

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false,
    };
  }

  componentDidMount() {
    this.getUsers();
    //this.createMessage();
  }

  getUsers = () => {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`).then(res => {
      this.setState({users: res.data});
    }).catch(err => {
      console.log(err);
    });
  }

  addUser = (data) => {
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers();
        this.setState({ username: "", email: "" });
        this.handleCloseModal();
        this.createMessage('success', 'User added.');
      })
      .catch(err => {
        console.log(err);
        this.handleCloseModal();
        this.createMessage('danger', 'That user already exists.');
      });
  }

  removeUser = (user_id) => {
  axios.delete(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${user_id}`,)
  .then((res) => {
    this.getUsers();
    this.createMessage('success', 'User removed.');
  })
  .catch((err) => {
    console.log(err);
    this.createMessage('danger', 'Something went wrong.');
  });
};


  handleRegisterFormSubmit = (data) => {
  const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`
  axios.post(url, data)
  .then((res) => {
    console.log(res.data);
    this.createMessage('success', 'You have registered successfully.');
  })
  .catch((err) => { console.log(err); });
  this.createMessage('danger', 'That user already exists.');
};

handleLoginFormSubmit = (data) => {
  const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`
  axios.post(url, data)
  .then((res) => {
    this.setState({ accessToken: res.data.access_token });
    this.getUsers();
    window.localStorage.setItem('refreshToken', res.data.refresh_token);
    this.createMessage('success', 'You have logged in successfully.');
  })
  .catch((err) => { console.log(err); });
  this.createMessage('danger', 'Incorrect email and/or password.');
};

validRefresh = () => {
  const token = window.localStorage.getItem('refreshToken');
  if (token) {
    axios
    .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/refresh`, {
      refresh_token: token
    })
    .then(res => {
      this.setState({ accessToken: res.data.access_token });
      this.getUsers();
      window.localStorage.setItem('refreshToken', res.data.refresh_token);
      return true;
    })
    .catch(err => {
      return false;
    });
  }
  return false;
};

isAuthenticated = () => {
  if (this.state.accessToken || this.validRefresh()) {
    return true;
  }
  return false;
};

logoutUser = () => {
  window.localStorage.removeItem('refreshToken');
  this.setState({ accessToken: null });
  this.createMessage('success', 'You have logged out.');
};

createMessage = (type, text) => {
  this.setState({
    messageType: type,
    messageText: text,
  });
};

removeMessage = () => {
  this.setState({
    messageType: null,
    messageText: null,
  });
};

handleOpenModal = () => {
  this.setState({ showModal: true });
};

handleCloseModal = () => {
  this.setState({ showModal: false });
};

  render() {
    return (
      <div>
        <NavBar
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />

        <section className="hero is-fullheight is-default is-bold">
          <div className="hero-body">
            <div className="container">
              <div className="columns is-vcentered">
                <div className="column is-5 is-offset-1 landing-caption">
                  <h1 className="title is-1 is-bold is-spaced">
                    Meet FRED: Flask + REact + Docker
                  </h1>
                  <h2 className="subtitle is-5 is-muted">A Boilerplate for Full-Stack Development</h2>
                  <div className="button-wrap">
                    <a href="#whatfreduses" target="_blank" className="button cta is-rounded primary-btn raised">
                      What Fred uses?
                    </a>
                    <a href="https://github.com/harrywang/fred" target="_blank" className="button cta is-rounded">
                      Where is Fred?
                    </a>
                  </div>
                </div>
                <div className="column is-5">
                  <figure className="image is-4by3">
                    <a href="https://undraw.co/"><img src={ process.env.PUBLIC_URL + '/img/illustrations/designer.svg'} alt="fred at work"/></a>
                  </figure>
                </div>

              </div>
            </div>
          </div>

        </section>

        <section id="whatfreduses" className="section section-feature-grey is-medium">
          <div className="container">
            <div className="title-wrapper has-text-centered">
              <h2 className="title is-2">What Fred Uses</h2>
              <h3 className="subtitle is-5 is-muted">to make you happy</h3>
              <div className="divider is-centered"></div>
            </div>

            <div className="content-wrapper">
              <div className="columns is-multiline icon-list">

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="flask-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://flask.palletsprojects.com/en/1.1.x/" target="_blank">Flask</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="logo-react" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://reactjs.org/" target="_blank">React</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="cube-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://www.docker.com/" target="_blank">Docker</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="server-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://www.postgresql.org/" target="_blank">Postgres</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="layers-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://www.sqlalchemy.org/" target="_blank">SQLAlchemy</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="logo-css3" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://bulma.io/" target="_blank">Bulma</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="git-compare-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://circleci.com/" target="_blank">CircleCI</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="rocket-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://www.heroku.com/" target="_blank">Heroku</a></h4>
                  </div>
                </div>



                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="logo-nodejs" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://nodejs.org/" target="_blank">Nodejs</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="logo-npm" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://www.npmjs.com/" target="_blank">NPM</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="flashlight-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://jestjs.io/" target="_blank">Jest</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="reader-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://jaredpalmer.com/formik/" target="_blank">Formik</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="logo-python" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://www.python.org/" target="_blank">Python</a></h4>
                  </div>
                </div>



                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="hammer-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://docs.pytest.org/" target="_blank">PyTest</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="key-outline" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://jwt.io/" target="_blank">JWT</a></h4>
                  </div>
                </div>

                <div className="column is-3">
                  <div className="feature-icon has-text-centered">
                    <div className="icon-wrap is-icon-reveal">
                      <ion-icon name="logo-github" size="large"></ion-icon>
                    </div>
                    <h4><a href="https://github.com" target="_blank">Github</a></h4>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>



        <section className="section">
          <div className="container">
            {this.state.messageType && this.state.messageText &&
              <Message
                messageType={this.state.messageType}
                messageText={this.state.messageText}
                removeMessage={this.removeMessage}
              />}
            <div className="columns">
              <div className="column is-half">
                <br />
                <Switch>
                  <Route exact path='/' render={() => (
                    <div>
                      <h1 className="title is-1">Users</h1>
                      <hr /><br />
                      {this.isAuthenticated() && (
                        <button
                          onClick={this.handleOpenModal}
                          className="button is-primary"
                        >
                          Add User
                        </button>
                      )}
                      <br /><br />
                      <Modal
                        isOpen={this.state.showModal}
                        style={modalStyles}
                      >
                        <div className="modal is-active">
                          <div className="modal-background" />
                          <div className="modal-card">
                            <header className="modal-card-head">
                              <p className="modal-card-title">Add User</p>
                              <button className="delete" aria-label="close" onClick={this.handleCloseModal} />
                            </header>
                            <section className="modal-card-body">
                              <AddUser addUser={this.addUser} />
                            </section>
                          </div>
                        </div>
                      </Modal>
                      <UsersList
                        users={this.state.users}
                        removeUser={this.removeUser}
                        isAuthenticated={this.isAuthenticated}
                      />
                    </div>
                  )} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <RegisterForm
                        // eslint-disable-next-line react/jsx-handler-names
                        handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />

                  <Route
                    exact
                    path='/login'
                    render={() => (
                      <LoginForm
                        // eslint-disable-next-line react/jsx-handler-names
                        handleLoginFormSubmit={this.handleLoginFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/status"
                    render={() => (
                      <UserStatus
                        accessToken={this.state.accessToken}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />

                  <Route exact path='/about' component={About} />
                  <Route
                    exact
                    path='/status'
                    render={() => (
                      <UserStatus
                        accessToken={this.state.accessToken}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
