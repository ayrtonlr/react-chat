import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { createMessage } from './ChannelCard';

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isLoading: false,
    };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    const { value } = this.state;
    const { userId, channelId } = this.props;
    this.setState({ value: '', isLoading: true });
    createMessage(userId, channelId, value, this.handleFinishSubmit);
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
      <CircularProgress />
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
};

MessageInput.defaultProps = {
  getMessages: () => {},
};

export default MessageInput;
