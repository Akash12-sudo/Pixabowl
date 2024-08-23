import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function Add({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      // console.log(data.uri);
      setImage(data.uri);
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
    }
  };

  if (!permission || !hasGalleryPermission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted || !hasGalleryPermission) {
    // Camera permissions are not granted yet
    return <Text>No access to camera</Text>;
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1 flex-row">
        <Camera
          ref={(ref) => setCamera(ref)}
          className="flex-1 aspect-square"
          ratio={"1:1"}
          type={type}
        />
      </View>
      <Button title="Flip Image" onPress={toggleCameraType} />
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image from Gallery" onPress={() => pickImage()} />
      <Button
        title="Save"
        onPress={() => navigation.navigate("Save", { image })}
      />

      {image && <Image source={{ uri: image }} className="flex-1" />}
    </View>
  );
}
