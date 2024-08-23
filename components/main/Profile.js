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
} from "firebase/firestore";
import { auth, db } from "../../components/auth/Firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

export default function Profile(props) {
  const navigation = useNavigation();

  const [userPost, setUserPost] = useState([]);
  const [user, setUser] = useState(null);
  const state = useSelector((state) => state.user);

  // Handle User Followers
  const [userFollowers, setUserFollowers] = useState(null);
  const [userFollowings, setUserFollowings] = useState(null);

  console.log("User is : ", state);

  const [following, setFollowing] = useState(false);

  const fetchUserFollowings = async (uid) => {
    try {
      const followingDocRef = collection(db, `following/${uid}/userFollowing`);
      const followingSnapshots = await getDocs(followingDocRef);

      console.log("Following Snapshot", followingSnapshots);
      let followinglist = [];
      if (followingSnapshots) {
        followinglist = followingSnapshots.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        console.log("FollowingList", followinglist);
        setUserFollowings(followinglist);
      }
    } catch (error) {
      console.log("Error at fetching different user's following list", error);
    }
  };

  const fetchUserFollowers = async (uid) => {
    try {
      const followersDocRef = collection(db, `followers/${uid}/userFollowers`);
      const followersSnapshots = await getDocs(followersDocRef);

      console.log("Followers Snapshot", followersSnapshots);
      let followerlist = [];
      if (followersSnapshots) {
        followerlist = followersSnapshots.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        console.log("Followers List", followerlist);
        setUserFollowers(followerlist);
      }
    } catch (error) {
      console.log("Error at fetching different user's followers list", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { currentUser, posts } = state;
      console.log("1" + props.route.params.uid);
      console.log("2" + auth.currentUser.uid);

      if (props.route.params.uid === auth.currentUser.uid) {
        setUser(currentUser);
        setUserPost(posts);
        setUserFollowers(state.followers);
        setUserFollowings(state.following);
      } else {
        const userCollection = collection(db, "users");
        const docRef = doc(userCollection, props.route.params.uid);

        const snapshot = await getDoc(docRef);
        console.log(snapshot);

        if (snapshot.exists()) {
          console.log("Snapshot: ", snapshot.data());
          // dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
          setUser(snapshot.data());
        } else {
          console.log("user doesn't exist");
        }

        // fetching followings
        fetchUserFollowings(props.route.params.uid);

        // fetching followers
        fetchUserFollowers(props.route.params.uid);

        // fetching post data
        try {
          const postCollection = collection(db, "posts");
          const documentRef = doc(postCollection, props.route.params.uid);
          const userPostsRef = collection(documentRef, "user_posts");

          console.log("userPostsRef:", userPostsRef);

          // Use the query function to create a query with ordering
          const orderedQuery = query(userPostsRef, orderBy("createdAt"));

          // Get the documents from query
          const querySnapshots = await getDocs(orderedQuery);

          const posts = querySnapshots.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          console.log(posts);
          setUserPost(posts);

          if (state.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
          } else {
            setFollowing(false);
          }

          // dispatch({ type: USER_POST_STATE_CHANGE, posts });
        } catch (e) {
          console.log("Error fetching the data", e);
        }
      }
    };
    fetchData();
    return;
  }, [props.route.params.uid, state.following]);

  // console.log(posts);
  console.log("User", user);
  const onFollow = async () => {
    try {
      const userCollections = collection(db, "following");
      const userDocRef = doc(userCollections, auth.currentUser.uid);
      const followersCollection = collection(userDocRef, "userFollowing");

      const userFollowingRef = doc(followersCollection, props.route.params.uid);
      const snapshot = await setDoc(userFollowingRef, {
        followed: true,
      });

      const UserFollowerCollections = collection(db, "followers");
      const NewUserDocRef = doc(
        UserFollowerCollections,
        props.route.params.uid
      );
      const UserFollowingCollection = collection(
        NewUserDocRef,
        "userFollowers"
      );

      const finalDocRef = doc(UserFollowingCollection, auth.currentUser.uid);
      const newSnapshot = await setDoc(finalDocRef, {
        following: true,
      });

      console.log("Successfully followed");
    } catch (e) {
      console.log("Error occured in onFollow", e);
    }
  };

  const onUnfollow = async () => {
    try {
      const userCollections = collection(db, "following");
      const userDocRef = doc(userCollections, auth.currentUser.uid);
      const followersCollection = collection(userDocRef, "userFollowing");

      const userFollowingRef = doc(followersCollection, props.route.params.uid);
      const deleteUser = await deleteDoc(userFollowingRef);

      const UserFollowerCollections = collection(db, "followers");
      const NewUserDocRef = doc(
        UserFollowerCollections,
        props.route.params.uid
      );
      const UserFollowingCollection = collection(
        NewUserDocRef,
        "userFollowers"
      );

      const finalDocRef = doc(UserFollowingCollection, auth.currentUser.uid);
      const newSnapshot = await deleteDoc(finalDocRef);

      console.log("Successfully unfollowed");
    } catch (e) {
      console.log("Error occured in onFollow", e);
    }
  };

  const logoutHandler = async () => {
    await auth.signOut();
  };

  if (user) {
    return (
      <SafeAreaView className="flex-1 items-center pt-20 w-full ">
        <View className="w-full flex-0.5 flex-col p-2">
          <View className="w-full flex justify-center items-start gap-y-2 px-2 mb-4">
            <Text className="font-bold text-3xl antialiased tracking-widest">
              {user.name}
            </Text>
          </View>
          <View className="flex flex-row w-full justify-evenly items-center ">
            {user.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                className="rounded-full object-contain"
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-circle"
                color="gray"
                size={80}
              />
            )}
            <TouchableOpacity
              className="flex flex-row gap-x-1"
              onPress={() =>
                navigation.navigate("ViewConnectionsPage", {
                  type: "followers",
                  list: userFollowers ? userFollowers : [],
                })
              }
            >
              <Text className="font-bold text-lg ">
                {userFollowers ? userFollowers.length : 0}
              </Text>
              <Text className="font-bold text-lg">followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row gap-x-1"
              onPress={() =>
                navigation.navigate("ViewConnectionsPage", {
                  type: "following",
                  list: userFollowings ? userFollowings : [],
                })
              }
            >
              <Text className="font-bold text-lg">
                {userFollowings ? userFollowings.length : 0}
              </Text>
              <Text className="font-bold text-lg">following</Text>
            </TouchableOpacity>
          </View>

          <View className="w-full px-2 items-start py-2">
            <Text className="text-slate-500 tracking-widest font-semibold antialiased">
              {user.email}
            </Text>
          </View>

          {user && user.bio && (
            <View className="w-full px-2 items-start flex-wrap mb-4 text-ellipsis">
              <Text className="text-black tracking-wide font-semibold antialiased">
                {user.bio}
              </Text>
            </View>
          )}

          <View className="w-full flex flex-row items-center justify-around ">
            {props.route.params.uid === auth.currentUser.uid && (
              <>
                <TouchableOpacity
                  className="border border-slate-300 rounded-lg px-10 py-2 bg-gray-100"
                  style={{ elevation: 1 }}
                  onPress={() =>
                    navigation.navigate("EditProfile", {
                      uid: auth.currentUser.uid,
                    })
                  }
                >
                  <Text className="font-bold text-slate-700">Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border border-slate-300 rounded-lg px-10 py-2 bg-gray-100"
                  style={{ elevation: 1 }}
                  onPress={() => logoutHandler()}
                >
                  <View className="flex flex-row gap-x-1 items-center">
                    <AntDesign name="logout" size={16} />
                    <Text className="font-bold text-slate-700">Logout</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {props.route.params.uid !== auth.currentUser.uid && (
              <View>
                {following ? (
                  <TouchableOpacity
                    className="border border-slate-300 rounded-lg px-10 py-2 bg-gray-100"
                    style={{ elevation: 1 }}
                    onPress={() => onUnfollow()}
                  >
                    <Text className="font-bold text-slate-700">Following</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="border border-slate-300 rounded-lg px-10 py-2 bg-gray-100"
                    style={{ elevation: 1 }}
                    onPress={() => onFollow()}
                  >
                    <Text className="font-bold text-slate-700">Follow</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>

        <View className=" flex-1 mt-20 basis-auto w-full bg-white">
          <FlatList
            numColumns={3}
            horizontal={false}
            data={userPost}
            className="flex-1 "
            renderItem={({ item }) => {
              return (
                <View className="flex-1 p-1 border-t border-slate-200 bg-white">
                  <Image
                    className="flex-1 aspect-square object-contain"
                    source={{ uri: item.url }}
                  />
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}
