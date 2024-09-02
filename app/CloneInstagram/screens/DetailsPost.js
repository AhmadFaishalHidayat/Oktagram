import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useQuery, gql, useMutation } from '@apollo/client';
import { AntDesign, SimpleLineIcons, Feather, Octicons } from '@expo/vector-icons';

const GET_POST_DETAIL = gql`
query PostById($id: ID) {
  postById(_id: $id) {
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

const ADD_LIKE = gql`
mutation AddLike($postId: ID) {
  addLike(postId: $postId)
}
`;

const COMMENT = gql`
mutation AddComment($content: String, $postId: ID) {
  addComment(content: $content, postId: $postId)
}
`;

function DetailPostScreen({ route }) {
    const { id } = route.params;
    const { loading, error, data, refetch } = useQuery(GET_POST_DETAIL, {
        variables: { id: route.params?.id },
    });

    const [likedPosts, setLikedPosts] = useState([]);
    const [doLike, { loadingLike, errorLike, dataLike }] = useMutation(ADD_LIKE)

    const handleLike = async (postId) => {
        try {
            const likePost = await doLike({
                variables: {
                    postId
                },
                refetchQueries: [
                    GET_POST_DETAIL
                ],
            });
            const isLiked = likedPosts.includes(postId)
            ToastAndroid.showWithGravity('Successfully Like Post!', ToastAndroid.LONG, ToastAndroid.TOP);
            const updatedLikedPosts = isLiked
                ? likedPosts.filter((id) => id !== postId)
                : [...likedPosts, postId];

            setLikedPosts(updatedLikedPosts);
        } catch (error) {
            ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }

    const [newComment, setNewComment] = useState('');
    const [addComment] = useMutation(COMMENT);

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            try {
                await addComment({
                    variables: {
                        postId: id,
                        content: newComment,
                    },
                    refetchQueries: [{ query: GET_POST_DETAIL, variables: { id: route.params?.id } }],
                });
                setNewComment('');
                refetch();
                ToastAndroid.showWithGravity('Successfully Create Comment', ToastAndroid.LONG, ToastAndroid.TOP);
            } catch (error) {
                ToastAndroid.showWithGravity(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
            }
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.comment}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ backgroundColor: "blue", color: "white", fontWeight: "bold", borderRadius: 50, width: 20, textAlign: 'center', alignItems: 'center', textAlignVertical: "center", marginRight: 3 }}>{item.username[0]}</Text>
                <Text style={styles.commentUsername}>{item?.username}</Text>
            </View>
            <Text>{item.content}</Text>
        </View>
    );

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const post = data.postById;
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
            <ScrollView style={styles.post}>
                <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }} >
                    <Text style={{ backgroundColor: "blue", color: "white", fontWeight: "bold", borderRadius: 50, width: 50, textAlign: 'center', alignItems: 'center', textAlignVertical: "center" }}>{post?.author?.username[0]}</Text>
                    <Text style={styles.user}>{post?.author?.username}</Text>
                </View>
                <Image source={{ uri: post?.imgUrl }} style={styles.image} />
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", marginTop: 10, marginHorizontal: 10 }}>
                    <View style={{ flexDirection: "row", gap: 15, }}>
                        <TouchableOpacity onPress={() => handleLike(post._id)}>
                            <View>
                                <AntDesign name="hearto" size={24} color={likedPosts.includes(post._id) ? "red" : "black"} />
                            </View>
                        </TouchableOpacity>

                        <View>
                            <SimpleLineIcons name="bubble" size={24} color="black" />
                        </View>

                        <Feather name="send" size={24} color="black" />
                    </View>
                    <Octicons name="bookmark" size={24} color="black" />
                </View>
                {post.likes && <View style={{ marginHorizontal: 10, marginTop: 5 }}>
                    <Text>Disukai {(post?.likes[post.likes.length - 1]?.username)} dan {post?.likes.length - 1} lainnya </Text>
                </View>}
                <View style={{ marginHorizontal: 10, marginTop: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {post?.author?.username}
                        <Text style={{ fontWeight: "400" }}>
                            {` ${post.content}`}
                        </Text>
                    </Text>
                    <Text style={{ marginTop: 5 }}>Tags: <Text style={{ fontWeight: "bold" }}>{post.tags}</Text></Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text>   </Text>
                </View>
            </ScrollView>
            <View style={{ backgroundColor: "grey" }}>
                <Text style={styles.commentsHeader}>Komentar</Text>

            </View>
            <FlatList
                data={post?.comments}
                renderItem={renderComment}
                keyExtractor={(item, idx) => idx}
                style={styles.commentsList}
            />
            <View style={styles.addCommentContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    post: {
        marginBottom: 20,
        padding: 10,
        flex: 1,
        backgroundColor: "white",
    },
    user: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
    },
    image: {
        width: '100%',
        height: 400,
    },
    comment: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    commentUsername: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        textAlign: "center",
    },
    commentsList: {
        flex: 1,
        backgroundColor: "grey"
    },
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    button: {
        marginLeft: 10,
        backgroundColor: '#3897f0',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default DetailPostScreen;
