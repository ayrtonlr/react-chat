import { useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import HttpService from '../services/HttpService';

export default function MessageInput(props) {
  const {
    userId,
    channelId,
    setNewMessage,
  } = props;
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const message = {
        userId,
        channelId,
        createdAt: new Date().toISOString(),
        content: value,
        isFirst: false,
      };
      await HttpService.createMessage(message);
      setValue('');
      setNewMessage(true);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      onSubmit={(event) => handleSubmit(event)}
      className="d-flex justify-content-between align-items-center"
    >
      <Form.Group
        controlId="formMessage"
        className="m-1 w-100"
      >
        <Form.Control
          type="text"
          placeholder="Message..."
          value={value}
          onChange={
            (event) => setValue(event.target.value)
          }
        />
      </Form.Group>
      <Button
        className="m-1"
        variant="primary"
        type="submit"
        disabled={!value}
      >
        {isLoading || error ? (
          <Spinner
            as="span"
            animation="border"
          />
        )
          : 'Send'}
      </Button>
    </Form>
  );
}

MessageInput.propTypes = {
  userId: PropTypes.number.isRequired,
  channelId: PropTypes.number.isRequired,
  setNewMessage: PropTypes.func.isRequired,
};
