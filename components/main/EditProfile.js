import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { RadioButton } from "react-native-paper";
import { auth, db } from "../auth/Firebase";
import { collection, setDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function EditProfile(props) {
  //   console.log("uid", props.route.params.uid);
  const navigation = useNavigation();

  const userState = useSelector((state) => state.user);
  const [name, setName] = useState(userState.currentUser.name);
  const [username, setUsername] = useState(
    userState.currentUser.username ? userState.currentUser.username : ""
  );
  const [bio, setBio] = useState(
    userState.currentUser.bio ? userState.currentUser.bio : ""
  );
  const [gender, setGender] = useState(
    userState.currentUser.gender ? userState.currentUser.gender : "Male"
  );

  const handleProfileUpdate = async () => {
    console.log(name, username, bio, gender);

    try {
      const userCollection = collection(db, "users");
      const docRef = doc(userCollection, props.route.params.uid);
      console.log(docRef);

      const response = await updateDoc(docRef, {
        name,
        username,
        bio,
        gender,
      });

      navigation.navigate("Feed");
    } catch (error) {
      console.error("Error", error);
      Alert.alert("Failed to update");
    }
  };

  return (
    <SafeAreaView className="w-full flex-1 items-start justify-start px-2">
      <View className="w-full flex-1 flex-col gap-y-2 justify-center items-center">
        {userState.currentUser.profile_image ? (
          <Image
            source={{ uri: userState.currentUser.profile_image }}
            className="rounded-full object-contain"
            style={{ width: 90, height: 90 }}
          />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            color="gray"
            size={100}
          />
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProfileImage")}
        >
          <Text className="font-semibold text-sky-600 tracking-wide ">
            Edit profile image
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        className="p-2 w-full flex-1 flex-col gap-y-2 mb-40  "
      >
        <View className="w-full items-start gap-y-2 border-b border-gray-200">
          <Text className="font-semibold tracking-wide antialiased text-sky-600">
            Name
          </Text>
          <TextInput
            placeholder={userState.currentUser.name}
            placeholderTextColor="gray"
            className="mb-4"
            editable={true}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View className="w-full items-start gap-y-2 border-b border-gray-200">
          <Text className="font-semibold tracking-wide antialiased text-sky-600">
            Username
          </Text>
          <TextInput
            placeholder="Add a username"
            placeholderTextColor="gray"
            className="mb-4"
            editable={true}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="w-full items-start gap-y-2 border-b border-gray-200">
          <Text className="font-semibold tracking-wide antialiased text-sky-600">
            Bio
          </Text>
          <TextInput
            placeholder="Tell us about you..."
            placeholderTextColor="gray"
            className="mb-4 py-2"
            multiline
            editable={true}
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <View className="w-full items-center gap-y-2 pt-5 flex flex-row justify-around">
          <Text className="font-semibold tracking-wide antialiased text-sky-600">
            Gender
          </Text>
          <View className="flex flex-col items-center">
            <RadioButton.Android
              value="Male"
              status={gender === "Male" ? "checked" : "unchecked"}
              onPress={() => setGender("Male")}
              color="#007BFF"
            />
            <Text>Male</Text>
          </View>
          <View className="flex flex-col items-center">
            <RadioButton.Android
              value="Female"
              status={gender === "Female" ? "checked" : "unchecked"}
              onPress={() => setGender("Female")}
              color="#007BFF"
            />
            <Text>Female</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      <View className="w-full pb-10  justify-center items-center">
        <TouchableOpacity
          className="border border-slate-500 rounded-lg px-10 py-2 bg-gray-100"
          style={{ elevation: 1 }}
          onPressIn={() => {
            handleProfileUpdate();
          }}
          activeOpacity={0.9}
        >
          <Text className="font-bold text-slate-500">Save Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
