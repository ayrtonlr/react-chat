import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HttpService from '../services/HttpService';
import ChannelList from './ChannelList';
import Channel from './Channel';

export default function App(props) {
  const { userId } = props;
  const [user, setUser] = useState({});
  const [selectedChannel, setSelectedChannel] = useState({});
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const singleUser = await HttpService.getUser(userId);
        const channelsList = await HttpService.listChannels();
        setUser(singleUser);
        setChannels(channelsList);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userId]);

  useEffect(() => {
    async function loadMessages() {
      try {
        setIsLoading(true);
        const messagesList = await HttpService.listMessages(selectedChannel.id);
        setMessages(messagesList);
        setNewMessage(false);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();
  }, [selectedChannel, newMessage]);

  async function handleChannelJoin(channelId) {
    try {
      setIsLoading(true);
      const userChannels = [...user.channels, channelId];
      const newUser = { ...user, channels: [...new Set(userChannels)] };
      // First Message is "user joined the channel"
      const firstMessage = {
        userId,
        channelId,
        createdAt: new Date().toISOString(),
        content: '',
        isFirst: true,
      };
      const updatedUser = await HttpService.updateUser(userId, newUser);
      await HttpService.createMessage(firstMessage);
      setUser(updatedUser);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChannelSelect(channelId) {
    setSelectedChannel(
      channels.find((channel) => channel.id === channelId),
    );
  }

  if (error) {
    return <h1>Error</h1>;
  }

  if (isLoading) {
    return <h1>Is Loading</h1>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <ChannelList
            channels={channels}
            userChannels={user.channels}
            handleChannelJoin={
              (channelId) => handleChannelJoin(channelId)
            }
            handleChannelSelect={
              (channelId) => handleChannelSelect(channelId)
            }
            selectedChannel={selectedChannel}
          />
        </Col>
        <Col>
          {messages.length > 0 && (
            <Channel
              messages={messages}
              channel={selectedChannel}
              userId={user.id}
              setNewMessage={setNewMessage}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

App.propTypes = {
  userId: PropTypes.number,
};

App.defaultProps = {
  userId: 1,
};
