import React from "react";
import {
  Button,
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 justify-around items-center">
      <View className=" w-full h-auto flex-1 items-center justify-end pb-10">
        <Icon name="instagram" size={70} className="" />
      </View>

      <View className="flex-1 w-full justify-center items-center px-4 gap-y-4">
        <TextInput
          placeholder="Email"
          style={{ elevation: 4 }}
          className="w-full p-2 rounded-lg placeholder:bg-white placeholder:px-4 border-2 border-gray-300 placeholder:font-semibold placeholder:text-1xl placeholder:tracking-widest placeholder:text-slate-600 "
        />
        <TextInput
          placeholder="Password"
          style={{ elevation: 4 }}
          className="w-full p-2 rounded-lg placeholder:bg-white  placeholder:px-4 border-2 border-gray-300 placeholder:font-semibold placeholder:text-1xl placeholder:tracking-widest placeholder:text-slate-600"
          secureTextEntry
        />
      </View>

      {/* <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      /> */}
      <View className="flex-1 w-full px-4 justify-start items-center">
        <TouchableOpacity
          className="w-full bg-sky-600 rounded-xl p-3 mb-4 items-center"
          onPress={() => navigation.navigate("Login")}
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
