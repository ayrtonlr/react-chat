import React from 'react';
import PropTypes from 'prop-types';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      channelMessages: [],
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  componentDidUpdate(prevProps) {
    const { channel } = this.props;
    const { channel: prevChannel } = prevProps;
    if (prevChannel.id !== channel.id) {
      this.setState({ channelMessages: [] });
      this.getMessages();
    }
  }

  getMessages = () => {
    const { channel } = this.props;
    this.setState({ isLoading: true });
    fetch(`http://localhost:3004/messages/?channelId=${channel.id}&_expand=user&_expand=channel&_sort=createdAt`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ channelMessages: data });
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  render() {
    const { channel, userId } = this.props;
    const { isLoading, channelMessages } = this.state;

    return isLoading && channelMessages.length === 0 ? (
      <h1>Loading</h1>
    ) : (
      <>
        <h1>{channel.name}</h1>
        {channelMessages.map((message) => {
          const messageObj = {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            isFirst: message.isFirst,
            messageUserId: message.userId,
            userFullName: `${message.user.firstName} ${message.user.lastName}`,
          };
          return (
            <MessageCard
              key={message.id}
              record={messageObj}
              userId={userId}
              channelId={channel.id}
              getMessages={this.getMessages}
            />
          );
        })}
        <MessageInput
          getMessages={this.getMessages}
          channelId={channel.id}
          userId={userId}
        />
      </>
    );
  }
}

Channel.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  userId: PropTypes.number.isRequired,
};

Channel.defaultProps = {
  channel: {},
};

export default Channel;
