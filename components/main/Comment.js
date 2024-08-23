import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../auth/Firebase";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersData } from "../../redux/actions/index";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Comment = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  const state = useSelector((state) => state.usersState);
  const dispatch = useDispatch();

  useEffect(() => {
    const matchUserToComment = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = state.users.find((el) => el.uid === comments[i].creator);
        if (user === undefined) {
          dispatch(fetchUsersData(comments[i].creator, false));
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    };

    const handler = async () => {
      if (props.route.params.postId !== postId) {
        const postDocRef = doc(
          collection(db, `posts/${props.route.params.uid}/user_posts`),
          props.route.params.postId
        );
        const commentsCollectionRef = collection(postDocRef, "comments");

        try {
          const snapshot = await getDocs(commentsCollectionRef);
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data };
          });
          matchUserToComment(comments);
          setPostId(props.route.params.postId);
        } catch (error) {
          console.error("Error fetching comments", error);
        }
      } else {
        matchUserToComment(comments);
      }
    };

    handler();
  }, [props.route.params.postId, state.users]);

  const onCommentSend = async () => {
    if (!text) {
      return Alert.alert("Comment is empty");
    }

    const postDocRef = doc(
      collection(db, `posts/${props.route.params.uid}/user_posts`),
      props.route.params.postId
    );
    const commentsCollectionRef = collection(postDocRef, "comments");

    try {
      const snapshot = await addDoc(commentsCollectionRef, {
        creator: auth.currentUser.uid,
        text,
      });
      console.log(snapshot);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center w-full ">
      <View className="flex justify-center items-center pt-10 pb-5  w-full ">
        <Text className="text-2xl font-semibold tracking-widest text-slate-500">
          Comments
        </Text>
      </View>
      <KeyboardAvoidingView className="flex-1 w-full items-start justify-start bg-white rounded-tl-2xl rounded-tr-2xl">
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          className="p-4"
          renderItem={({ item }) => (
            <View className="flex flex-row items-start py-3">
              <MaterialCommunityIcons
                name="account-circle"
                color="gray"
                size={28}
              />
              <View className="flex flex-col mt-1  px-2 justify-center">
                {item.user !== undefined ? (
                  <Text className="font-bold tracking-wide antialiased">
                    {item.user.name}
                  </Text>
                ) : null}
                <Text className="text-slate-800 antialiased">{item.text}</Text>
              </View>
            </View>
          )}
        />

        <View className="flex flex-row justify-between w-full items-center pb-4 border-t border-gray-200">
          <TextInput
            placeholder="Add your comment here..."
            className="mx-2 p-2 flex-wrap w-70"
            onChangeText={(text) => setText(text)}
          />

          <MaterialIcons
            onPress={() => onCommentSend()}
            name="add-circle"
            color="teal"
            size={30}
            style={{ marginRight: 20 }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Comment;
