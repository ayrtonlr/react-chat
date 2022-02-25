import React from 'react';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ChannelList from './ChannelList';
import Channel from './Channel';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      channelSelected: {},
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    fetch(`http://localhost:3004/users/${userId}/`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ user: data });
      });
  }

  setChannelSelected = (obj) => {
    this.setState({ channelSelected: obj });
  };

  render() {
    const { userId } = this.props;
    const { user, channelSelected } = this.state;

    return user.id ? (
      <Container>
        <Row>
          <Col>
            <ChannelList
              user={user}
              setChannelSelected={this.setChannelSelected}
            />
          </Col>
          <Col>
            {channelSelected.id && (
            <Channel
              channel={channelSelected}
              userId={userId}
            />
            )}
          </Col>
        </Row>
      </Container>
    ) : null;
  }
}

App.propTypes = {
  userId: PropTypes.number,
};

App.defaultProps = {
  userId: 1,
};

export default App;
