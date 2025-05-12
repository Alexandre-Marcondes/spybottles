import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { 
    Image, 
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );
  
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.20:3000/v1.0.0/auth/login', {
        email: username,
        password: password,
      });
  
      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);
      navigation.replace('Home');
    } catch (error: any) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', 'Invalid credentials or server issue.');
    }
  };
  

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={{ flex: 1 }}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
        {!isKeyboardVisible && 
        <Image style={styles.logo}
         source={require('../../assets/logo.png')}
        />}
    
        <Text style={styles.title}>Welcome to SPYBOTTLES </Text>
        <Text style={styles.subtitle}>Please sign in </Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonWrapper}>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      </View>
    </View>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>

  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 40,
      backgroundColor: 'rgba(120,88,4,0.8)',
      alignItems: 'center',
    },
    logo: {
      width: 140,
      height: 140,
      marginBottom: 70,
      marginTop: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: 'white',
      marginBottom: 70,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      backgroundColor: 'white',
    },
    button: {
        backgroundColor: 'rgba(120,88,4,1)', 
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        borderColor: 'white',
        borderWidth: 1,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      
    buttonWrapper: {
      width: '100%',
      marginTop: 10,
    },
  });
  
