import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createMessage } from './ChannelCard';

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
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
    const { getMessages } = this.props;
    fetch(`http://localhost:3004/messages/${messageId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ content: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        getMessages();
      });
  };

  handleSubmit = (event) => {
    const { value } = this.state;
    const {
      userId,
      channelId,
      currentValue,
      messageId,
      getMessages,
    } = this.props;
    if (currentValue && messageId) {
      this.updateMessage(messageId, value);
    } else {
      createMessage(userId, channelId, value, getMessages);
    }
    this.setState({ value: '' });
    event.preventDefault();
  };

  render() {
    const { value } = this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className="d-flex justify-content-between align-items-center"
      >
        <Form.Group
          controlId="formMessage"
          className="m-1 w-100"
        >
          <Form.Control
            type="text"
            placeholder="Message..."
            value={value}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button
          className="m-1"
          variant="primary"
          type="submit"
          disabled={!value}
        >
          Send
        </Button>
      </Form>
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
