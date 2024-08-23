import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../auth/Firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function ViewConnections(props) {
  const navigation = useNavigation();

  const type = props.route.params.type;
  const list = props.route.params.list;

  const [updatedList, setUpdatedList] = useState([]);

  useEffect(() => {
    const fetchConnectionsDetails = async () => {
      setUpdatedList([]);
      try {
        for (let i = 0; i < list.length; i++) {
          let uid = list[i];
          const docRef = doc(collection(db, "users"), uid);
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            let id = snapshot.id;
            let data = snapshot.data();
            setUpdatedList((prev) => [
              ...prev,
              {
                id,
                data,
              },
            ]);
            console.log("Updated list", updatedList);
          } else {
            console.log("Can't get connection list");
          }
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchConnectionsDetails();
    return () => {};
  }, []);

  console.log("type", type);
  console.log("list", list);

  return (
    <View className="w-full flex-1 justify-start items-center p-2">
      <View className="bg-white p-8 flex items-center w-full mt-40 border border-slate-300 rounded-tl-full rounded-tr-full">
        <Text className="font-bold antialiased tracking-wide text-xl text-slate-700 capitalize">
          {type}
        </Text>
      </View>
      <View className="w-full h-full bg-white flex items-start justify-center ">
        <FlatList
          horizontal={false}
          numColumns={1}
          data={updatedList}
          className="pt-5"
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex flex-row items-start py-3 px-5"
              onPress={() => navigation.navigate("Profile", { uid: item.id })}
            >
              {item && item.data.profile_image ? (
                <Image
                  source={{ uri: item.data.profile_image }}
                  className="rounded-full object-contain"
                  style={{ width: 26, height: 26 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-circle"
                  color="gray"
                  size={28}
                />
              )}

              <View className="flex flex-col mt-1  px-2 justify-center">
                <Text className="font-semibold tracking-wide antialiased">
                  {item.data.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
