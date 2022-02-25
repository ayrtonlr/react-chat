import HttpClient from './HttpClient';

class UserService {
  constructor() {
    this.httpClient = new HttpClient('http://localhost:3004');
  }

  async getUser(id) {
    return this.httpClient.get(`/users/${id}`);
  }

  async updateUser(id, user) {
    return this.httpClient.patch(`/users/${id}`, user);
  }

  async listChannels() {
    return this.httpClient.get('/channels');
  }

  async createMessage(message) {
    return this.httpClient.post('/messages', message);
  }

  async listMessages(channelId) {
    const path = `/messages/?channelId=${channelId}&_expand=user&_sort=createdAt`;
    return this.httpClient.get(path);
  }
}

export default new UserService();
