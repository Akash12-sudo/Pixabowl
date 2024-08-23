import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../components/auth/Firebase";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import UserProfile from "../../assets/images/user.png";

export default function FeedScreen(props) {
  const navigation = useNavigation();
  const [Posts, setPosts] = useState([]);
  const [likeButtonState, setLikeButtonState] = useState({
    liked: false,
    name: "cards-heart-outline",
    color: "black",
  });

  const currentUserState = useSelector((state) => state.user);
  const usersState = useSelector((state) => state.usersState);
  console.log("Usersstate", usersState.users);
  console.log("Current UserState", currentUserState);

  // console.log(usersState.usersLoaded, currentUserState.following.length);

  useEffect(() => {
    let posts = [];
    if (
      usersState.usersFollowingLoaded === currentUserState.following.length &&
      currentUserState.following.length !== 0
    ) {
      for (let i = 0; i < currentUserState.following.length; i++) {
        const user = usersState.users.find(
          (el) => el.uid === currentUserState.following[i]
        );
        if (user) {
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort(function (x, y) {
        return x.createdAt - y.createdAt;
      });

      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        console.log(post.createdAt);
        const { nanoseconds, seconds } = post.createdAt;

        // Convert nanoseconds to milliseconds
        const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);

        // Create a new Date object using setMilliseconds
        const date = new Date(0); // Pass 0 to initialize with the epoch time
        date.setUTCMilliseconds(milliseconds);

        // Extract day, month, and year
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Months are zero-based
        const year = date.getUTCFullYear();

        // Update the post with the formatted date
        post.newDate = `${day}/${month}/${year}`;
      }

      setPosts(posts);
    }
  }, [usersState.usersFollowingLoaded]);

  console.log("Feed Posts...", Posts);

  const likeActionHandler = async (uid, postId) => {
    try {
      const postLikesRef = doc(
        collection(db, `posts/${uid}/user_posts`),
        postId
      );

      const docSnapshot = await getDoc(postLikesRef);
      const data = docSnapshot.data();

      let likesArray = data.likes || [];

      // Check if auth.currentUser.uid is already in the array
      const isUserLiked = likesArray.includes(auth.currentUser.uid);

      // If not already in the array, add it
      if (!isUserLiked) {
        likesArray = [...likesArray, auth.currentUser.uid];

        // Update the Firestore document with the modified 'likes' array
        await updateDoc(postLikesRef, {
          likes: likesArray,
        });

        const snapshots = onSnapshot(postLikesRef, (doc) => {
          const data = doc.data();
          console.log("New snapshot data: ", data);
          setPosts((prevPosts) => {
            const postIndex = prevPosts.findIndex((post) => post.id === postId);
            if (postIndex !== -1) {
              const updatedPosts = [...prevPosts];
              updatedPosts[postIndex].likes = likesArray;
              return updatedPosts;
            }
            return prevPosts;
          });
        });
      } else {
        console.log("User already liked the post.");
      }

      console.log("Like added successfully");
    } catch (error) {
      console.error("Error at likeActionHandler", error);
    }
  };

  const dislikeActionHandler = async (uid, postId) => {
    try {
      const postLikesRef = doc(
        collection(db, `posts/${uid}/user_posts`),
        postId
      );

      const docSnapshot = await getDoc(postLikesRef);
      const data = docSnapshot.data();

      let likesArray = data.likes || [];

      // Check if auth.currentUser.uid is in the array
      const isUserLiked = likesArray.includes(auth.currentUser.uid);

      // If the user is in the array, remove it
      if (isUserLiked) {
        likesArray = likesArray.filter(
          (userId) => userId !== auth.currentUser.uid
        );

        // Update the Firestore document with the modified 'likes' array
        await updateDoc(postLikesRef, {
          likes: likesArray,
        });

        const snapshots = onSnapshot(postLikesRef, (doc) => {
          const data = doc.data();
          console.log("New snapshot data: ", data);
          setPosts((prevPosts) => {
            const postIndex = prevPosts.findIndex((post) => post.id === postId);
            if (postIndex !== -1) {
              const updatedPosts = [...prevPosts];
              updatedPosts[postIndex].likes = likesArray;
              return updatedPosts;
            }
            return prevPosts;
          });
        });
      } else {
        console.log("User is not in the liked list.");
      }

      console.log("Liked deleted successfully");
    } catch (error) {
      console.error("Error at dislikeActionHandler", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start ">
      <View className="py-8 flex flex-col w-full justify-start items-start  px-4">
        <Text className="text-slate-700 text-3xl font-semibold antialiased tracking-widest">
          Pixabowl
        </Text>
        <FlatList
          horizontal={true}
          data={usersState.users}
          renderItem={({ item }) => (
            <View className="flex flex-col gap-y-2 p-2 items-center justify-start ">
              {item.profile_image ? (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate("Profile", { uid: item.uid })
                  }
                >
                  <Image
                    source={{ uri: item.profile_image }}
                    className="rounded-full object-contain"
                    style={{ width: 80, height: 80 }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate("Profile", { uid: item.uid })
                  }
                >
                  <Image
                    source={UserProfile}
                    className="rounded-full object-contain"
                    style={{ width: 80, height: 80 }}
                  />
                </TouchableOpacity>
              )}
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
      <View className="flex-1 w-full">
        <FlatList
          numColumns={1}
          horizontal={false}
          data={Posts}
          className="mt-4"
          renderItem={({ item }) => {
            return (
              <View
                className=" gap-y-2  m-2 rounded-lg  bg-white"
                style={{ elevation: 2 }}
              >
                <View className="px-2 flex flex-row gap-x-2 items-center justify-start">
                  {item.user.profile_image ? (
                    <Image
                      source={{ uri: item.user.profile_image }}
                      className="rounded-full object-contain"
                      style={{ width: 28, height: 28 }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-circle"
                      color="gray"
                      size={28}
                    />
                  )}

                  <Text className="font-semibold antialiased">
                    {item.user.name}
                  </Text>
                </View>
                <Image
                  source={{ uri: item.url }}
                  className="object-contain w-full"
                  style={{ aspectRatio: 1 / 1 }}
                />
                <View className="px-1 flex flex-row gap-x-4 items-center justify-start">
                  <MaterialCommunityIcons
                    onPress={() => {
                      item.likes && item.likes.includes(auth.currentUser.uid)
                        ? dislikeActionHandler(item.user.uid, item.id)
                        : likeActionHandler(item.user.uid, item.id);
                    }}
                    key={item.id}
                    name={
                      item.likes && item.likes.includes(auth.currentUser.uid)
                        ? "cards-heart"
                        : "cards-heart-outline"
                    }
                    color={
                      item.likes && item.likes.includes(auth.currentUser.uid)
                        ? "red"
                        : "black"
                    }
                    size={30}
                    style={{ marginTop: 2 }}
                  />
                  <FontAwesomeIcons
                    name="comment-o"
                    size={28}
                    onPress={() =>
                      navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      })
                    }
                  />
                </View>
                <TouchableOpacity
                  className="px-2 flex flex-row gap-x-2 items-center justify-start"
                  onPress={() =>
                    navigation.navigate("ViewConnectionsPage", {
                      type: "All likes",
                      list: item.likes,
                    })
                  }
                >
                  <Text className="font-bold antialiased tracking-wide">
                    {item.likes ? item.likes.length : 0}
                  </Text>
                  <Text className="font-bold antialiased tracking-wide">
                    Likes
                  </Text>
                </TouchableOpacity>

                <View className="px-2 flex flex-row gap-x-2 items-center justify-start ">
                  <Text className="font-bold antialiased">
                    {item.user.name}
                  </Text>
                  <Text className="font-semibold text-slate-700 antialiased tracking-wide">
                    {item.caption}
                  </Text>
                </View>
                <View className="p-2">
                  <Text
                    onPress={() =>
                      navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      })
                    }
                    className="tracking-wide antialiased font-semibold text-slate-600"
                  >
                    View All Comments...
                  </Text>
                  <Text className="tracking-widest text-slate-500">
                    {item.newDate}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
