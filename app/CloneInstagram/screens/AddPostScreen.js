import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { gql, useMutation } from '@apollo/client';

const ADD_POST = gql`
mutation AddPost($post: NewPost) {
  addPost(post: $post)
}
`;
const GET_POSTS = gql`
query Posts {
  posts {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      _id
      username
      email
    }
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
  }
}
`;


function AddPostScreen({ navigation }) {
    const [content, setContent] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [tags, setTags] = useState('');

    const [doAddPost, { data, loading, error }] = useMutation(ADD_POST)

    const handleAddPost = async () => {
        try {
            const postData = await doAddPost({
                variables: {
                    post: {
                        content: content,
                        imgUrl: imgUrl,
                        tags: tags,
                    },

                },
                refetchQueries: [GET_POSTS],
            });
            console.log(postData);
            // Setelah berhasil menambahkan postingan, navigasi kembali ke layar Home
            ToastAndroid.showWithGravity('Successfully Create Post!', ToastAndroid.LONG, ToastAndroid.TOP);
            navigation.navigate('Home');
        } catch (error) {
            ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Content</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter content"
                value={content}
                onChangeText={setContent}
            />
            <Text style={styles.label}>Image URL</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter image URL"
                value={imgUrl}
                onChangeText={setImgUrl}
            />
            <Text style={styles.label}>Tags (comma separated)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter tags"
                value={tags}
                onChangeText={setTags}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddPost}>
                <Text style={styles.buttonText}>{loading ? "loading..." : "Add Post"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
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
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddPostScreen;
