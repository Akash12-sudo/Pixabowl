import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function AddProfileImage() {
  const navigation = useNavigation();

  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImage(data.uri);
      navigation.navigate("SaveProfileImage", { image: data.uri });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      navigation.navigate("SaveProfileImage", { image: result.assets[0].uri });
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-start">
      <View className="flex flex-row ">
        <Camera
          ref={(ref) => setCamera(ref)}
          className="flex-1 aspect-square "
          ratio={"1:1"}
          type={type}
        />
      </View>
      <View className="absolute  w-full h-full ">
        <MaterialIcons
          name="flip-camera-android"
          size={40}
          color="white"
          style={{ marginTop: 300, marginLeft: 25 }}
          onPress={toggleCameraType}
        />
      </View>
      <View className="flex-1  w-full items-center justify-center">
        <TouchableOpacity
          className="border border-slate-300 rounded-full p-10 bg-white flex items-center justify-center"
          style={{ elevation: 2 }}
          onPress={() => takePicture()}
        >
          <MaterialIcons name="camera-alt" size={30} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row w-full  border-t border-slate-200 justify-center items-center">
        <TouchableOpacity
          className="w-1/2 py-4 flex justify-center items-center border-r border-slate-200"
          onPress={() => pickImage()}
        >
          <Text className="antialiased tracking-wide text-slate-500 font-semibold">
            GALLERY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-1/2 py-4 items-center border-r border-slate-200 ">
          <Text className="antialiased tracking-wide text-slate-500 font-semibold">
            TAKE PICTURE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
