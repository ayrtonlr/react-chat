import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';

import MessageInput from './MessageInput';

export default function Channel(props) {
  const {
    messages, channel, userId, setNewMessage,
  } = props;

  return (
    <div>
      <h1 className="text-center">{channel.name}</h1>
      <Card className="m-3">
        {messages.map((message) => {
          const createdAt = new Date(message.createdAt).toLocaleString();
          const userName = message.user && message.user.name;
          const isOwnUser = message.user && message.user.id === userId;
          const alignItems = isOwnUser ? 'align-items-end' : 'align-items-start';

          return message.isFirst ? (
            <div key={message.id} className="text-center">
              <p className="m-3">{`${userName} joined the group - ${createdAt}`}</p>
            </div>
          ) : (
            <Card key={message.id} className="m-1">
              <Card.Body className={`d-flex flex-column ${alignItems}`}>
                <Card.Text>
                  {`${userName} - ${createdAt}`}
                </Card.Text>
                <Card.Title className="m-0">{message.content}</Card.Title>
              </Card.Body>
            </Card>
          );
        })}
        <MessageInput
          userId={userId}
          channelId={channel.id}
          setNewMessage={setNewMessage}
        />
      </Card>
    </div>
  );
}

Channel.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    channelId: PropTypes.number,
    userId: PropTypes.number,
    isFirst: PropTypes.bool,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      channels: PropTypes.arrayOf(PropTypes.number),
    }),
  })),
  channel: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  userId: PropTypes.number,
  setNewMessage: PropTypes.func,
};

Channel.defaultProps = {
  channel: {},
  messages: [],
  userId: 0,
  setNewMessage: () => {},
};
