import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export const createMessage = (userId, channelId, content = '', nextAction = null) => {
  fetch('http://localhost:3004/messages/', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      channelId,
      createdAt: new Date().toISOString(),
      content,
      isFirst: !content,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(() => {
      if (nextAction) {
        nextAction();
      }
    });
};

class ChannelCard extends React.Component {
  handleClick = (item) => {
    const {
      userId, record, changeState, userChannelIds,
    } = this.props;
    const channels = [...userChannelIds, item.id];
    fetch(`http://localhost:3004/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ channels: [...new Set(channels)] }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        changeState({ userChannelIds: data.channels || [] });
        createMessage(data.id, record.id);
      });
  };

  render() {
    const { record, noAdd, setChannelSelected } = this.props;

    return (
      <Card className="m-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <Card.Title className="m-0">{record.name}</Card.Title>
          <Button
            variant="primary"
            onClick={() => (!noAdd ? this.handleClick(record) : setChannelSelected(record))}
          >
            {!noAdd ? 'Join' : 'Select'}
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

ChannelCard.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  changeState: PropTypes.func,
  noAdd: PropTypes.bool,
  userId: PropTypes.number,
  userChannelIds: PropTypes.arrayOf(PropTypes.number),
  setChannelSelected: PropTypes.func,
};

ChannelCard.defaultProps = {
  record: {},
  noAdd: false,
  changeState: () => {},
  setChannelSelected: () => {},
  userId: 1,
  userChannelIds: [],
};

export default ChannelCard;
