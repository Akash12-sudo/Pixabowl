import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./components/auth/Firebase";
import LandingScreen from "./components/auth/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import MainScreen from "./components/Main";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentScreen from "./components/main/Comment";
import VerifyEmailPage from "./components/auth/VerifyEmail";
import EditProfilePage from "./components/main/EditProfile";
import AddProfileImage from "./components/main/AddProfileImage";
import SaveProfileImage from "./components/main/SaveProfileImage";
import ViewConnections from "./components/main/ViewConnections";

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createNativeStackNavigator();

export default function App() {
  const [authState, setAuthState] = useState({
    loggedIn: false,
    loaded: false,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setAuthState({ loggedIn: false, loaded: true });
      } else {
        setAuthState({
          loggedIn: true,
          loaded: true,
        });
      }
    });

    // Unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, []);

  if (!authState.loaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (!authState.loggedIn) {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Save"
            component={SaveScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Comment"
            component={CommentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VerifyEmail"
            component={VerifyEmailPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfilePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddProfileImage"
            component={AddProfileImage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SaveProfileImage"
            component={SaveProfileImage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewConnectionsPage"
            component={ViewConnections}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
