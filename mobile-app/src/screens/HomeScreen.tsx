import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { createSession, fetchInProgressSessions } from '../services/sessionService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { screens } from '../navigation/screens';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [sessions, setSessions] = useState<{ _id: string; name?: string }[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.replace('Login');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await fetchInProgressSessions();
      setSessions(data);
    };
    loadSessions();
  }, []);
  
  // This is calling the backend to start a session
const handleStartSession = async () => {
    const newSession = await createSession();
    navigation.navigate('Session', { sessionId: newSession._id });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const renderItem = ({ item }: { item: { _id: string; name?: string } }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => navigation.navigate('Session', { sessionId: item._id })}
    >
      <Text style={styles.sessionText}>{item.name || 'Unnamed Session'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <View style={styles.topRow}>
      <Image source={require('../../assets/transparentLogo.png')} style={styles.logo} />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>
      <Text style={styles.header}>Welcome back, Bob </Text>
      <Text style={styles.subHeader}>Inventory Sessions</Text>

      {sessions.length === 0 ? (
        <Text style={styles.emptyText}>No active sessions. Start one below!</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          style={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartSession}
      >
        <Text style={styles.buttonText}>Start New Session</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(120,88,4,0.8)',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginBottom: 30,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: 'rgba(120,88,4,1)',
    fontWeight: 'bold',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(120,88,4,1)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  sessionItem: {
    padding: 15,
    backgroundColor: '#fffef8',
    marginBottom: 10,
    borderRadius: 8,
  },
  sessionText: {
    fontSize: 18,
    color: '#333',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
});