import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
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
    const createdAt = new Date(record.createdAt).toLocaleString();

    if (record.isFirst) {
      return (
        <div className="text-center">
          <p className="m-3">{`${record.userFullName} joined the group - ${createdAt}`}</p>
        </div>
      );
    }

    const isOwnUser = userId === record.messageUserId;
    const alignItems = isOwnUser ? 'align-items-end' : 'align-items-start';

    return (
      <Card className="m-1">
        <Card.Body className={`d-flex flex-column ${alignItems}`}>
          <Card.Text>
            {`${record.userFullName} - ${new Date(record.createdAt).toLocaleString()}`}
          </Card.Text>
          {isEditing ? (
            <MessageInput
              getMessages={this.finishEditing}
              channelId={channelId}
              userId={userId}
              currentValue={record.content}
              messageId={record.id}
            />
          ) : (
            <>
              <Card.Title className="m-0">{record.content}</Card.Title>
              {isOwnUser && (
              <div className="mt-2">
                <Button
                  className="m-1"
                  type="button"
                  onClick={() => this.setState({ isEditing: true })}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="m-1"
                  type="button"
                  onClick={() => this.handleDelete(record.id)}
                >
                  Delete
                </Button>
              </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
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
