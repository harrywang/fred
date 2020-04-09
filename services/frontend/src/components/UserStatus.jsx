import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: ""
    };
  }
  componentDidMount() {
    this.getUserStatus();
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.accessToken}`
      }
    };
    return axios(options)
      .then(res => {
        this.setState({
          email: res.data.email,
          username: res.data.username
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <div>

        <section className="hero is-halfheight">
          <div className="hero-body">
            <div className="container">
              <h1 className="title has-text-centered">User Status</h1>

              <div className="columns is-mobile is-centered">
                <div className="column is-one-third is-mobile is-centered">
                  <ul>
                    <li>
                      <strong>Email:</strong>&nbsp;
                      <span data-testid="user-email">{this.state.email}</span>
                    </li>
                    <li>
                      <strong>Username:</strong>&nbsp;
                      <span data-testid="user-username">{this.state.username}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

UserStatus.propTypes = {
  accessToken: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired
};

export default UserStatus;
