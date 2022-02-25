import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function ChannelList(props) {
  const {
    channels,
    userChannels,
    selectedChannel,
    handleChannelJoin,
    handleChannelSelect,
  } = props;

  return (
    <div>
      <h1 className="text-center">Channels</h1>
      {channels.map((record) => (
        <Card key={record.id} className="m-3">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <Card.Title className="m-0">{record.name}</Card.Title>
            {userChannels.includes(record.id) ? (
              <Button
                variant="success"
                onClick={() => handleChannelSelect(record.id)}
                style={selectedChannel.id === record.id ? { display: 'none' } : {}}
              >
                Select
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => handleChannelJoin(record.id)}
              >
                Join
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

ChannelList.propTypes = {
  channels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  userChannels: PropTypes.arrayOf(PropTypes.number),
  selectedChannel: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  handleChannelJoin: PropTypes.func,
  handleChannelSelect: PropTypes.func,
};

ChannelList.defaultProps = {
  channels: [],
  userChannels: [],
  selectedChannel: {},
  handleChannelJoin: () => {},
  handleChannelSelect: () => {},
};
