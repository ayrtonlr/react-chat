import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import ChannelList from './ChannelList';
import Channel from './Channel';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isLoading: true,
      channelSelected: {},
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    fetch(`http://localhost:3004/users/${userId}/`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ user: data });
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  setChannelSelected = (obj) => {
    this.setState({ channelSelected: obj });
  };

  render() {
    const { userId } = this.props;
    const { user, isLoading, channelSelected } = this.state;

    return isLoading ? (
      <CircularProgress />
    ) : (
      <>
        <ChannelList
          user={user}
          setChannelSelected={this.setChannelSelected}
        />
        {channelSelected.id && (
          <Channel
            channel={channelSelected}
            userId={userId}
          />
        )}
      </>
    );
  }
}

App.propTypes = {
  userId: PropTypes.number,
};

App.defaultProps = {
  userId: 1,
};

export default App;
