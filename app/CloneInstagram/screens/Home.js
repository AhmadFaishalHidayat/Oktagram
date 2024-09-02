import { ActivityIndicator, FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  post: {
    marginBottom: 20,
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

const ADD_LIKE = gql`
mutation AddLike($postId: ID) {
  addLike(postId: $postId)
}
`;

function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState()
  const [likedPosts, setLikedPosts] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_POSTS)
  const [doLike, { loadingLike, errorLike, dataLike }] = useMutation(ADD_LIKE)
  console.log({ loading, error, data });
  console.log(data?.posts);

  const handleLike = async (postId) => {
    try {
      const likePost = await doLike({
        variables: {
          postId
        },
        refetchQueries: [
          GET_POSTS
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
  console.log(data, "<<<<<<<<<<>>>>>>>>>>>>>");
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3897f0" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }} >
        <Text style={{ backgroundColor: "blue", color: "white", fontWeight: "bold", borderRadius: 50, width: 50, textAlign: 'center', alignItems: 'center', textAlignVertical: "center" }}>{item.author?.username[0]}</Text>
        <Text style={styles.user}>{item.author.username}</Text>
      </View>
      <Image source={{ uri: item.imgUrl }} style={styles.image} />
      <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", marginTop: 10, marginHorizontal: 10 }}>
        <View style={{ flexDirection: "row", gap: 15, }}>
          <TouchableOpacity onPress={() => handleLike(item._id)}>
            <View>
              <AntDesign name="hearto" size={24} color={likedPosts.includes(item._id) ? "red" : "black"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DetailsPost', { id: item._id })}>
            <View>
              <SimpleLineIcons name="bubble" size={24} color="black" />
            </View>
          </TouchableOpacity>

          <Feather name="send" size={24} color="black" />
        </View>
        <Octicons name="bookmark" size={24} color="black" />
      </View>
      {item.likes && <View style={{ marginHorizontal: 10, marginTop: 5 }}>
        <Text>Disukai {(item.likes[item.likes.length - 1].username)} dan {item.likes.length - 1} lainnya </Text>
      </View>}
      <TouchableOpacity onPress={() => navigation.navigate('DetailsPost', { id: item._id })}>
        <View style={{ marginHorizontal: 10, marginTop: 5 }}>
          <Text style={{ fontWeight: "bold" }}>
            {item.author.username}

            <Text style={{ fontWeight: "400", marginHorizontal: 10, marginTop: 5 }}>
              {item.content.length > 100 ? ` ${item.content.slice(0, 100)} selengkapnya` : ` ${item.content}`}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View >
  );

  // useEffect(() => {
  //   refetch()
  // }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

export default HomeScreen;