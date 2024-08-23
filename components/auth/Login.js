import { useState } from "react";
import React from "react";
import {
  Button,
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "./Firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";

export default function Login({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    const { email, password } = userInfo;
    try {
      if (!email || !password) {
        return Alert.alert("Error", "Fill all details");
      }

      const account = await signInWithEmailAndPassword(auth, email, password);
      console.log(account);
      // Alert.alert("Success", "User registered successfully");
    } catch (error) {
      console.error("Error!!", error.code);
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Error", "Your email or password was incorrect");
      } else {
        Alert.alert("Error", "There was a problem with your request");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-around items-center">
      <View className=" w-full h-auto flex-1 items-center justify-end pb-10">
        <Icon name="instagram" size={70} className="" />
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-full justify-center items-center px-4 gap-y-4"
      >
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={{ elevation: 4 }}
          onChangeText={(email) => setUserInfo({ ...userInfo, email })}
          className="w-full p-2 rounded-lg placeholder:bg-white placeholder:px-4 border-2 border-gray-300 placeholder:font-semibold placeholder:text-1xl placeholder:tracking-widest placeholder:text-slate-600 "
        />
        <TextInput
          placeholder="Password"
          style={{ elevation: 4 }}
          onChangeText={(password) => setUserInfo({ ...userInfo, password })}
          className="w-full p-2 rounded-lg placeholder:bg-white  placeholder:px-4 border-2 border-gray-300 placeholder:font-semibold placeholder:text-1xl placeholder:tracking-widest placeholder:text-slate-600"
          secureTextEntry
        />
      </KeyboardAvoidingView>

      {/* <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      /> */}
      <View className="flex-1 w-full px-4 justify-start items-center">
        <TouchableOpacity
          className="w-full bg-sky-600 rounded-xl p-3 mb-4 items-center"
          onPress={handleSignUp}
        >
          <Text className="font-semibold text-1xl tracking-widest text-white">
            Log In
          </Text>
        </TouchableOpacity>
        <Text className="font-semibold text-blue-600 text-1xl tracking-wider underline">
          Forgotten Password?
        </Text>
        <View className="w-full mt-16 flex flex-col justify-center items-center">
          <TouchableOpacity
            className="w-full items-center mx-10 border-2 bg-gray-100 border-slate-200 rounded-xl p-2"
            style={{ elevation: 4 }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="font-semibold tracking-wider antialiased ">
              Create new account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
