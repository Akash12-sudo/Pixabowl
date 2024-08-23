import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  Button,
  Text,
  ActivityIndicator,
} from "react-native";
import "firebase/storage";
import { auth, storage, db } from "../auth/Firebase";
import {
  addDoc,
  setDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

export default function SaveProfileImage(props) {
  const navigation = useNavigation();

  const image = props.route.params.image;
  console.log("Hi", image);
  console.log(auth.currentUser.uid);

  const [Progress, setProgress] = useState(0);

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();

    const childPath = `profile/"${
      auth.currentUser.uid
    }/${new Date().getTime()}`;
    const storageRef = ref(storage, childPath);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log("Upload is" + progress + "% done");
      },
      (e) => {
        console.log(e);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File availiable at", downloadURL);
          // Save record
          await saveRecord(downloadURL);
        });
      }
    );
  };

  const saveRecord = async (url) => {
    try {
      const collectionRef = collection(db, "users");
      const docRef = doc(collectionRef, auth.currentUser.uid);

      await updateDoc(docRef, {
        profile_image: url,
      });

      navigation.popToTop();

      console.log("document saved correctly", docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    uploadImage();
  }, []);

  return (
    <View className="flex-1 items-center justify-center w-full">
      <ActivityIndicator size="large" color="blue" />
      <View className="flex flex-row justify-center gap-x-4">
        <Text className="tracking-widest font-bold text-xl text-yellow-700/75">
          {Progress}% done
        </Text>
      </View>
    </View>
  );
}
