import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';

const GET_USERBYUSERNAME = gql`
query UserByUsername($username: String) {
  userByUsername(username: $username) {
    _id
    name
    username
    email
    
  }
}
`;

const FOLLOW = gql`
mutation AddFollow($newFollow: NewFollow) {
  addFollow(newFollow: $newFollow) {
    _id
    followingId
    followerId
    createdAt
    updatedAt
  }
}
`;
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

function SearchScreen({ navigation }) {

    const [searchQuery, setSearchQuery] = useState('');
    const { loading, error, data } = useQuery(GET_USERBYUSERNAME, { variables: { username: searchQuery } })
    const [followUser] = useMutation(FOLLOW);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleFollow = async (userId) => {
        try {
            await followUser({
                variables: {
                    newFollow: {
                        followingId: userId
                    }
                },
                refetchQueries: [GET_USERBYID]
            });

            ToastAndroid.showWithGravity(`Anda telah follow ${data.userByUsername[0].username}`, ToastAndroid.LONG, ToastAndroid.TOP);
        } catch (error) {
            ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.userItem}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={{ marginRight: 5, backgroundColor: "blue", color: "white", fontWeight: "bold", borderRadius: 50, width: 50, textAlign: 'center', alignItems: 'center', textAlignVertical: "center" }}>{item.username[0]}</Text>
                <Text style={styles.username}>{item.username}</Text>
                <TouchableOpacity style={styles.followButton} onPress={() => handleFollow(item._id)}>
                    <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    console.log(data, "ini data Search");

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={data?.userByUsername}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                style={styles.userList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    userList: {
        flex: 1,
    },
    userItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    fullName: {
        fontSize: 14,
        color: '#888',
    },
    followButton: {
        backgroundColor: '#3897f0',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 100,
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});

export default SearchScreen;
