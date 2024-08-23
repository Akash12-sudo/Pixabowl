import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth, storage, db } from "../auth/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Search({ navigation }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = async (search) => {
    const usersCollection = collection(db, "users");

    const usersQuery = query(usersCollection, where("name", ">=", search));

    const snapshots = await getDocs(usersQuery);
    console.log(snapshots);

    const users = snapshots.docs
      ? snapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      : [];
    console.log(users);

    setUsers(users);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search user..."
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { uid: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  input: {
    margin: 20,
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
  },
});
