import axios from "axios";

const API_BASE = "http://localhost:5000";

export const sendChat = async (messages) => {
  const { data } = await axios.post(`${API_BASE}/api/chat`, { messages });
  return data.reply;
};

export const health = async () => {
  const { data } = await axios.get(`${API_BASE}/api/health`);
  return data;
};
