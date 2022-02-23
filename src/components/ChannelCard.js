import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

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
    changeState({ isLoading: true });
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
      })
      .finally(() => changeState({ isLoading: false }));
  };

  render() {
    const { record, noAdd, setChannelSelected } = this.props;

    return (
      <div>
        <p>{record.name}</p>
        {!noAdd ? (
          <Button
            variant="contained"
            onClick={() => this.handleClick(record)}
          >
            Add
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => setChannelSelected(record)}
          >
            Select
          </Button>
        )}
      </div>
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
