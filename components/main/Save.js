import React from "react";
import { View, TextInput, Image, Button } from "react-native";
import "firebase/storage";
import { auth, storage, db } from "../auth/Firebase";
import {
  addDoc,
  setDoc,
  collection,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

export default function Save(props) {
  const navigation = useNavigation();

  const image = props.route.params.image;
  console.log(image);

  const [caption, setCaption] = React.useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();

    const childPath = `post/"${auth.currentUser.uid}/${new Date().getTime()}`;
    const storageRef = ref(storage, childPath);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is" + progress + "% done");
      },
      (e) => {
        console.log(e);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File availiable at", downloadURL);
          // Save record
          await saveRecord("image", downloadURL, serverTimestamp());
        });
      }
    );
  };

  const saveRecord = async (fileType, url, createdAt) => {
    try {
      // const docRef = await addDoc(collection(db, "posts"), {
      //   fileType,
      //   url,
      //   createdAt,
      // });
      const collectionRef = collection(db, "posts");
      const documentRef = doc(collectionRef, auth.currentUser.uid);
      const userPostRef = collection(documentRef, "user_posts");
      const docRef = await addDoc(userPostRef, {
        url,
        caption,
        createdAt,
        likes: [],
      });

      navigation.popToTop();
      console.log("document saved correctly", docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1">
      <Image source={{ uri: props.route.params.image }} />
      <TextInput placeholder="Write a Caption ..." onChangeText={setCaption} />
      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
}
