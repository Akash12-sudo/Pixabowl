import { View, Text } from "react-native";
import { auth } from "./Firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emailVerification } from "../../redux/actions";

export default function VerifyEmail() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(auth.currentUser.emailVerified);
    if (auth.currentUser.emailVerified) {
      dispatch(emailVerification());
    }
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-semibold">
        Waiting for email to be verified
      </Text>
    </View>
  );
}
