import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import {
  clearData,
  emailVerification,
  fetchUser,
  fetchUserFollowers,
  fetchUserFollowing,
  fetchUserPosts,
} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import FeedScreen from "./main/Feed";
import SettingsScreen from "./main/Settings";
import ProfileScreen from "./main/Profile";
import AddScreen from "./main/Add";
import SearchScreen from "./main/Search";
import { auth, db } from "./auth/Firebase";
import VerifyEmail from "./auth/VerifyEmail";
import { collection, doc, onSnapshot } from "firebase/firestore";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

function MainScreen() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const currentUser = userState.currentUser;

  useEffect(() => {
    dispatch(clearData());
    dispatch(fetchUser());
    dispatch(fetchUserPosts());
    dispatch(fetchUserFollowing());
    dispatch(fetchUserFollowers(auth.currentUser.uid));
    dispatch(emailVerification(auth.currentUser.uid));
  }, [dispatch]);

  // if (!userState.emailVerified) {
  //   return <VerifyEmail />;
  // }

  return (
    <Tab.Navigator initialRouteName="Feed" labeled={false}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AddContainer"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Add");
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", { uid: auth.currentUser.uid });
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// const mapStateToProps = (state) => ({
//   currentUser: state.currentUser,
// });

// export default connect(mapStateToProps)(MainScreen);
export default connect()(MainScreen);
