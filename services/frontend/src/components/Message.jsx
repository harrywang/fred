import React from "react";
import PropTypes from "prop-types";


const Message = props => {
  return (
    <div class="container">
      <section data-testid="message">
        <div className={`notification is-${props.messageType}`}>
          <button
            className="delete"
            onClick={() => {
              props.removeMessage();
            }}
          />
          {props.messageText}
        </div>
      </section>
    </div>
  );
};

Message.propTypes = {
  messageType: PropTypes.string.isRequired,
  messageText: PropTypes.string.isRequired,
  removeMessage: PropTypes.func.isRequired
};

export default Message;
