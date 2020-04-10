import React from "react";
import PropTypes from "prop-types";

const RandomQuotes = props => {
  return (
    <section
      className="section is-medium  has-background-image"
      data-color="#4FC1EA"
      data-background="https://source.unsplash.com/random/1600x900"
      data-color-opacity=".6"
    >
      <div className="overlay"></div>
      <div className="container">
        <div className="title-wrapper has-text-centered">
          <h2 className="title is-2 light-text is-spaced">Quotes of the Day</h2>
          <a href="http://source.unsplash.com">
            <p className="light-text">Random Background Image from Unsplash</p>
          </a>
        </div>

        <div className="content-wrapper">
          <div className="columns is-vcentered">
            {props.random_quotes.map(random_quote => {
              return (
                <div key={random_quote.id} className="column is-4">
                  <figure className="testimonial">
                    <blockquote>{random_quote.content}</blockquote>
                    <div className="author">
                      <h5>{random_quote.author_name}</h5>
                    </div>
                  </figure>
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
  random_quotes: PropTypes.array.isRequired
};

export default RandomQuotes;
