import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      this.getMessages();
    }
  }

  getMessages = () => {
    const { channel } = this.props;
    fetch(`http://localhost:3004/messages/?channelId=${channel.id}&_expand=user&_expand=channel&_sort=createdAt`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ channelMessages: data });
      });
  };

  render() {
    const { channel, userId } = this.props;
    const { channelMessages } = this.state;

    return (
      <div>
        <h1 className="text-center">{channel.name}</h1>
        <Card className="m-3">
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
        </Card>
      </div>
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
