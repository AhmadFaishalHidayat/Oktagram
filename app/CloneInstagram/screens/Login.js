import { gql, useMutation } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

const LOGIN = gql`
mutation Login($email: String, $password: String) {
  login(email: $email, password: $password) {
    accessToken
  }
}
`;

function LoginScreen({ navigation }) {
  const { setIsSignedIn } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doLogin, { loading }] = useMutation(LOGIN)

  const handleLogin = async () => {
    try {
      const result = await doLogin({
        variables: {
          email: email,
          password: password,
        },
      });
      console.log(result);
      await SecureStore.setItemAsync(
        "accessToken",
        result.data?.login?.accessToken
      );
      setIsSignedIn(true);
      ToastAndroid.showWithGravity('Successfully Login', ToastAndroid.LONG, ToastAndroid.TOP);
      navigation.navigate('Home');
    } catch (error) {

      ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP)
    }

  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/oktagram (2).png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Kata sandi"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{loading ? "loading..." : "Masuk"}</Text>
      </TouchableOpacity>
      <View style={styles.signupTextContainer}>
        <Text style={styles.signupText}>Tidak punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupLink}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3897f0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    fontSize: 14,
    color: '#3897f0',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
