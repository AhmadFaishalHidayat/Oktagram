import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const REGISTER = gql`
mutation Register($user: NewUser) {
  register(user: $user) {
    _id
    name
    username
    email
  }
}
`;

function RegisterScreen() {
  const navigation = useNavigation()
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [doRegister, { loading }] = useMutation(REGISTER);

  const handleRegister = async () => {
    try {
      const result = await doRegister({
        variables: {
          user: {
            name: name,
            username: username,
            email: email,
            password: password,
          },
        },
      });
      console.log(result, "<<<<<<>>>>>>>>>");
      ToastAndroid.showWithGravity('Successfully Registered!', ToastAndroid.LONG, ToastAndroid.TOP);
      navigation.navigate('Login');
    } catch (error) {
      ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/oktagram (2).png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Nama pengguna"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{loading ? "loading..." : "Daftar"}</Text>
      </TouchableOpacity>
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Masuk</Text>
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
  loginTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#888',
  },
  loginLink: {
    fontSize: 14,
    color: '#3897f0',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
