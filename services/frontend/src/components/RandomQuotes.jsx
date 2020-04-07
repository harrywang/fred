import React from "react";
import PropTypes from "prop-types";

const RandomQuotes = props => {
  return (
    <section
      className="section is-medium  has-background-image"
      data-background="https://source.unsplash.com/random/1600x900"
      data-color="#4FC1EA"
      data-color-opacity=".6"
    >
      <div className="overlay"></div>
      <div className="container">
        <div className="title-wrapper has-text-centered">
          <h2 className="title is-2 light-text is-spaced">Quotes of the Day</h2>
          <a href="http://source.unsplash.com/">
            <p className="subtitle light-text">
              Random Background Image from Unsplash
            </p>
          </a>
        </div>

        <div className="content-wrapper">
          <div className="columns is-vcentered">
            {props.users.map(user => {
              return (
                <div className="column is-4">
                  <figure className="testimonial">
                    <blockquote>
                      {user.id} {user.email} Lorem ipsum dolor sit amet, elit
                      deleniti dissentias quo eu, hinc minim appetere
                    </blockquote>
                    <div className="author">
                      <h5>{user.username}</h5>
                    </div>
                  </figure>
                  {props.isAuthenticated() && (
                    <button
                      className="button is-danger is-small"
                      onClick={() => props.removeUser(user.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

RandomQuotes.propTypes = {
  users: PropTypes.array.isRequired,
  removeUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default RandomQuotes;
