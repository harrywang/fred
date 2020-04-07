import React from "react";

const Home = () => (
  <div>
    <section className="hero is-fullheight is-default is-bold">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered">
            <div className="column is-5 is-offset-1 landing-caption">
              <h1 className="title is-1 is-bold is-spaced">
                Meet FRED: Flask + REact + Docker
              </h1>
              <h2 className="subtitle is-5 is-muted">
                A Boilerplate for Full-Stack Development
              </h2>
              <div className="button-wrap">

                <a
                  href="#whatfreduses"

                  className="button cta is-rounded primary-btn raised"
                >
                  What Fred uses?
                </a>
                <a
                  href="https://github.com/harrywang/fred"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button cta is-rounded"
                >
                  Where is Fred?
                </a>
              </div>
            </div>
            <div className="column is-5">
              <figure className="image is-4by3">
                <a href="https://undraw.co/">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/img/illustrations/designer.svg"
                    }
                    alt="fred at work"
                  />
                </a>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="whatfreduses"
      className="section section-feature-grey is-medium"
    >
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
                <h4>
                  <a
                    href="https://flask.palletsprojects.com/en/1.1.x/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Flask
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="logo-react" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://reactjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    React
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="cube-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://www.docker.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Docker
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="server-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://www.postgresql.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Postgres
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="layers-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://www.sqlalchemy.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SQLAlchemy
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="logo-css3" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://bulma.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bulma
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="git-compare-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://circleci.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CircleCI
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="rocket-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://www.heroku.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Heroku
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="logo-nodejs" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://nodejs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nodejs
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="logo-npm" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://www.npmjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NPM
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="flashlight-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://jestjs.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Jest
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="reader-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://jaredpalmer.com/formik/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Formik
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="logo-python" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://www.python.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Python
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="hammer-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://docs.pytest.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PyTest
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="key-outline" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://jwt.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JWT
                  </a>
                </h4>
              </div>
            </div>

            <div className="column is-3">
              <div className="feature-icon has-text-centered">
                <div className="icon-wrap is-icon-reveal">
                  <ion-icon name="logo-github" size="large"></ion-icon>
                </div>
                <h4>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
