import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://192.168.1.20:3000';
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MyIsImVtYWlsIjoiYm9iIiwicm9sZSI6ImJhcnRlbmRlciIsImJpcnRoZGF5IjoiMTk4OC0wNS0wMSIsImJpeklkIjoid2Fpa2lraS1iYXItMDAzIiwibG9jYXRpb24iOnsibGF0IjoyMS4zMDY5LCJsb25nIjotMTU3Ljg1ODN9LCJpYXQiOjE3NDY1MTQyNzAsImV4cCI6MTc0NjUxNzg3MH0.OeSb4ksM6KZW4O9i-ROabH82nH9fmdROqlbZsYaFlAU'; // shorten for brevity

export const fetchInProgressSessions = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken') || DEV_TOKEN;
    const response = await axios.get(`${BASE_URL}/v1.0.0/session/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.sessions || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

export const createSession = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken') || DEV_TOKEN;

    const payload = {
      location: 'front bar',
      notes: 'yes',
      items: [
        {
          productId: 'string',
          quantity_full: 0,
          quantity_partial: 0.6,
        },
      ],
      sessionLabel: 'string',
    };
    const response = await axios.post(`${BASE_URL}/v1.0.0/session/start`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};
