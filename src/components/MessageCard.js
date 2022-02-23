import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

class MessageCard extends React.Component {
  handleDelete = (messageId) => {
    const { getMessages } = this.props;
    fetch(`http://localhost:3004/messages/${messageId}`, {
      method: 'DELETE',
    })
      .then(() => {
        getMessages();
      });
  };

  render() {
    const { record, userId } = this.props;

    if (record.isFirst) {
      return (
        <div>
          <p>{new Date(record.createdAt).toLocaleString()}</p>
          <p>{`${record.userFullName} entrou no grupo`}</p>
        </div>
      );
    }

    return userId === record.messageUserId ? (
      <div>
        <p>{new Date(record.createdAt).toLocaleString()}</p>
        <p>{record.content}</p>
        <Button
          variant="contained"
          onClick={() => this.handleDelete(record.id)}
        >
          Delete
        </Button>
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
  getMessages: PropTypes.func,
};

MessageCard.defaultProps = {
  record: {},
  getMessages: () => {},
};

export default MessageCard;
