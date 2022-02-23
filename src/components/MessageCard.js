import React from 'react';
import PropTypes from 'prop-types';

class MessageCard extends React.Component {
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
};

MessageCard.defaultProps = {
  record: {},
};

export default MessageCard;
