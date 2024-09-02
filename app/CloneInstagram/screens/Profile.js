import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, ToastAndroid, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../context/AuthContext';
import { gql, useQuery } from '@apollo/client';

const posts = [
  { id: '1', image: 'https://www.balisafarimarinepark.com/wp-content/uploads/2023/08/mau3-1024x683.webp' },
  { id: '2', image: 'https://www.balisafarimarinepark.com/wp-content/uploads/2023/08/mau3-1024x683.webp' },
  { id: '3', image: 'https://www.balisafarimarinepark.com/wp-content/uploads/2023/08/mau3-1024x683.webp' },
  { id: '4', image: 'https://www.balisafarimarinepark.com/wp-content/uploads/2023/08/mau3-1024x683.webp' },
  { id: '5', image: 'https://www.balisafarimarinepark.com/wp-content/uploads/2023/08/mau3-1024x683.webp' },
  { id: '6', image: 'https://www.balisafarimarinepark.com/wp-content/uploads/2023/08/mau3-1024x683.webp' },
];

const GET_USERBYID = gql`
query UserById($id: ID) {
  userById(_id: $id) {
    _id
    name
    username
    email
    followingDetail {
      _id
      name
      username
      email
    }
    followerDetail {
      _id
      name
      username
      email
    }
  }
}
`;

function ProfileScreen() {
  const { loading, error, data, refetch } = useQuery(GET_USERBYID)
  console.log({ data });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext)

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('accessToken')
    setIsSignedIn(false)
    ToastAndroid.showWithGravity('Anda telah Logout!', ToastAndroid.LONG, ToastAndroid.TOP);
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </View>
  );

  useEffect(() => {
    refetch()
  }, [])

  console.log(data, "Ini data User");
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3897f0" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDLcaoMqauKXsMZwJOio8tds2bjfB3WK3HnQ&s' }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{data.userById?.username}</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statCount}>{data.userById?.followerDetail.length}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statCount}>{data.userById?.followingDetail.length}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.dropdownButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Text style={styles.dropdownItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        style={styles.postsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  dropdownButton: {
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  postsList: {
    flex: 1,
  },
  postContainer: {
    flex: 1,
    margin: 1,
  },
  postImage: {
    width: '100%',
    height: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#3897f0',
  },
});

export default ProfileScreen;
