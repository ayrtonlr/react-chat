import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import ChannelCard from './ChannelCard';

class ChannelList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allChannels: [],
      userChannelIds: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({ userChannelIds: user.channels || [] });
    fetch('http://localhost:3004/channels/')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ allChannels: data });
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  changeState = (obj) => {
    this.setState(obj);
  };

  render() {
    const { user, setChannelSelected } = this.props;
    const { allChannels, userChannelIds, isLoading } = this.state;

    const remainingChannels = allChannels.filter(
      (item) => !userChannelIds.includes(item.id),
    );
    const userChannels = allChannels.filter(
      (item) => userChannelIds.includes(item.id),
    );

    return isLoading ? (
      <CircularProgress />
    ) : (
      <>
        <h1>All Channels</h1>
        {remainingChannels.map((item) => (
          <ChannelCard
            key={item.id}
            userId={user.id}
            record={item}
            changeState={this.changeState}
            userChannelIds={userChannelIds}
            setChannelSelected={setChannelSelected}
          />
        ))}
        <h1>My Channels</h1>
        {userChannels.map((item) => (
          <ChannelCard
            key={item.id}
            userId={user.id}
            record={item}
            changeState={this.changeState}
            userChannelIds={userChannelIds}
            setChannelSelected={setChannelSelected}
            noAdd
          />
        ))}
      </>
    );
  }
}

ChannelList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    channels: PropTypes.arrayOf(PropTypes.number),
  }),
  setChannelSelected: PropTypes.func,
};

ChannelList.defaultProps = {
  user: { channels: [] },
  setChannelSelected: () => {},
};

export default ChannelList;
