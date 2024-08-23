import { useState } from "react";
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
import Account from "../../assets/images/account.png";
import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "@firebase/auth";
import { db } from "./Firebase";
import { collection, addDoc, setDoc, doc } from "@firebase/firestore";
import { useDispatch } from "react-redux";
import { emailVerification } from "../../redux/actions";

export default function Register({ navigation }) {
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [emailState, setEmailState] = useState(false);

  const handleSignUp = async () => {
    const { name, email, password, cpassword } = userInfo;

    try {
      if (!name || !email || !password || !cpassword) {
        return Alert.alert("Error", "Fill all details");
      }

      if (password !== cpassword) {
        return Alert.alert("Error", "Passwords not matching...");
      }

      const newAccount = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(newAccount);

      // Send email verification
      const response = await sendEmailVerification(newAccount.user);

      // Checking if email is verified before saving to 'users' collection

      const user = auth.currentUser;
      console.log(user.emailVerified);

      await saveUserToCollection(name, email);
    } catch (error) {
      Alert.alert("Error", error.code);
      console.error("Error!!", error.code);
    }
  };

  const saveUserToCollection = async (name, email) => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, auth.currentUser.uid);

      await setDoc(docRef, { name, email });
    } catch (error) {
      console.error("Error saving user to collection:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-around items-center">
      <View className=" w-full h-auto flex-1 items-center justify-end pb-10">
        <Image source={Account} className="object-contain w-40 h-40" />
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-full justify-center items-center px-4 gap-y-4 "
      >
        <View className="w-full flex items-start">
          <Text className="text-3xl font-bold tracking-wide antialiased text-slate-700">
            Fill Your Details
          </Text>
        </View>
        <TextInput
          placeholder="Full Name"
          style={{ elevation: 4 }}
          onChangeText={(name) => setUserInfo({ ...userInfo, name })}
          className="w-full p-2 rounded-lg placeholder:bg-white placeholder:px-4 border-2 border-gray-300 placeholder:font-semibold placeholder:text-1xl placeholder:tracking-widest placeholder:text-slate-600 "
        />
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
        <TextInput
          placeholder="Confirm Password"
          style={{ elevation: 4 }}
          onChangeText={(cpassword) => setUserInfo({ ...userInfo, cpassword })}
          className="w-full p-2 rounded-lg placeholder:bg-white  placeholder:px-4 border-2 border-gray-300 placeholder:font-semibold placeholder:text-1xl placeholder:tracking-widest placeholder:text-slate-600"
          secureTextEntry
        />
      </KeyboardAvoidingView>

      <View className="flex-0.5 w-full px-4 justify-center  items-center">
        <TouchableOpacity
          className="w-full bg-sky-600 rounded-xl p-3 mt-20 items-center"
          onPress={handleSignUp}
        >
          <Text className="font-semibold text-1xl tracking-widest text-white">
            Create Account
          </Text>
        </TouchableOpacity>

        <View className=" w-full my-4 flex flex-col justify-start items-center">
          <Text className="tracking-wide antialiased text-blue-700 font-semibold">
            Already have an account?
          </Text>
          <TouchableOpacity
            className="w-full items-center mx-10 mt-4 border bg-gray-100 border-slate-200 rounded-xl p-2"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="font-semibold tracking-wider antialiased ">
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
