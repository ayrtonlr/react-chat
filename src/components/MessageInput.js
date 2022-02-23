import React from 'react';
import PropTypes from 'prop-types';
import { createMessage } from './ChannelCard';

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const { currentValue } = this.props;
    if (currentValue) {
      this.setState({ value: currentValue });
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  updateMessage = (messageId, value) => {
    fetch(`http://localhost:3004/messages/${messageId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ content: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        this.handleFinishSubmit();
      });
  };

  handleSubmit = (event) => {
    const { value } = this.state;
    const {
      userId, channelId, currentValue, messageId,
    } = this.props;
    this.setState({ value: '', isLoading: true });
    if (currentValue && messageId) {
      this.updateMessage(messageId, value);
    } else {
      createMessage(userId, channelId, value, this.handleFinishSubmit);
    }
    event.preventDefault();
  };

  handleFinishSubmit = () => {
    const { getMessages } = this.props;
    getMessages();
    this.setState({ isLoading: false });
  };

  render() {
    const { value, isLoading } = this.state;
    return isLoading ? (
      <h1>Loading</h1>
    ) : (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="message">
          <input id="message" type="text" value={value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

MessageInput.propTypes = {
  getMessages: PropTypes.func,
  userId: PropTypes.number.isRequired,
  channelId: PropTypes.number.isRequired,
  currentValue: PropTypes.string,
  messageId: PropTypes.number,
};

MessageInput.defaultProps = {
  getMessages: () => {},
  currentValue: '',
  messageId: 0,
};

export default MessageInput;
