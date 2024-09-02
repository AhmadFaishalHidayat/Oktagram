import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Button, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { ApolloProvider } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ProfileScreen from './screens/Profile';
import client from './config/apollo';
import { AuthContext } from './context/AuthContext';
import AddPostScreen from './screens/AddPostScreen';
import SearchScreen from './screens/SearchScreen';
import DetailPostScreen from './screens/DetailsPost';
const Stack = createNativeStackNavigator();


// function SearchScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Search Screen</Text>
//     </View>
//   );
// }
// function AddPostScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Add Post Screen</Text>
//     </View>
//   );
// }



const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-sharp';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-sharp';
          } else if (route.name === "Search") {
            iconName = focused ? 'search' : "search-sharp";
          } else if (route.name === "addPost") {
            iconName = focused ? 'add-circle-sharp' : "add-circle-sharp";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Search" component={SearchScreen} />
      <Tab.Screen options={{ headerShown: false }} name="addPost" component={AddPostScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}




export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  // check ada token atau tidak

  useEffect(() => {
    async function checkToken() {
      const result = await SecureStore.getItemAsync("accessToken");
      if (result) setIsSignedIn(true);
      setLoading(false);
    }
    checkToken();

  }, [])
  console.log(isSignedIn);
  if (loading) return <></>;

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        <NavigationContainer>
          <Stack.Navigator>

            {!isSignedIn ? (
              <>
                <Stack.Screen
                  name="Login"
                  options={{ headerShown: true }}
                  component={LoginScreen} />
                <Stack.Screen
                  name="Register"
                  options={{ headerShown: true }}
                  component={RegisterScreen} />
              </>)
              : (<>
                <Stack.Screen
                  name="Home"
                  options={{ title: 'Oktagram', headerTitleAlign: "center", headerBackVisible: false }}
                  component={BottomTabNavigator} />
                <Stack.Screen
                  name="DetailsPost"
                  options={{ headerShown: true }}
                  component={DetailPostScreen} />
              </>)
            }

          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

