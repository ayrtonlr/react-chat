import React from 'react';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';

class MessageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  handleDelete = (messageId) => {
    const { getMessages } = this.props;
    fetch(`http://localhost:3004/messages/${messageId}`, {
      method: 'DELETE',
    })
      .then(() => {
        getMessages();
      });
  };

  finishEditing = () => {
    const { getMessages } = this.props;
    getMessages();
    this.setState({ isEditing: false });
  };

  render() {
    const {
      record, userId, channelId,
    } = this.props;
    const { isEditing } = this.state;

    if (record.isFirst) {
      return (
        <div>
          <p>{new Date(record.createdAt).toLocaleString()}</p>
          <p>{`${record.userFullName} entrou no grupo`}</p>
        </div>
      );
    }

    if (isEditing) {
      return (
        <MessageInput
          getMessages={this.finishEditing}
          channelId={channelId}
          userId={userId}
          currentValue={record.content}
          messageId={record.id}
        />
      );
    }

    return userId === record.messageUserId ? (
      <div>
        <p>{new Date(record.createdAt).toLocaleString()}</p>
        <p>{record.content}</p>
        <button
          type="button"
          onClick={() => this.handleDelete(record.id)}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => this.setState({ isEditing: true })}
        >
          Edit
        </button>
      </div>
    ) : (
      <div>
        <p>{new Date(record.createdAt).toLocaleString()}</p>
        <p>{record.content}</p>
      </div>
    );
  }
}

MessageCard.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.number,
    messageUserId: PropTypes.number,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    isFirst: PropTypes.bool,
    userFullName: PropTypes.string,
  }),
  userId: PropTypes.number.isRequired,
  channelId: PropTypes.number.isRequired,
  getMessages: PropTypes.func,
};

MessageCard.defaultProps = {
  record: {},
  getMessages: () => {},
};

export default MessageCard;
