// actions/index.js
import {
  getDoc,
  getDocs,
  collection,
  doc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../components/auth/Firebase";
import {
  USER_STATE_CHANGE,
  USER_POST_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  CLEAR_DATA,
  TOGGLE_VERIFICATION,
  USER_FOLLOWERS_STATE_CHANGE,
} from "../constants/index";

export const clearData = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
};

export const emailVerification = (uid) => {
  return async (dispatch) => {
    // Listen for changes in email verification status...
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        dispatch({ type: TOGGLE_VERIFICATION, emailVerified: true });
        unsubscribe();
      } else {
        console.log("Email hasn't verified");
      }
    });
  };
};

export const fetchUser = () => {
  return async (dispatch) => {
    const userCollection = collection(db, "users");
    const docRef = doc(userCollection, auth.currentUser.uid);

    try {
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        // console.log(snapshot.data());
        dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
      } else {
        console.log("does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
};

export const fetchUserPosts = () => {
  return async (dispatch) => {
    const userCollection = collection(db, "posts");
    const documentRef = doc(userCollection, auth.currentUser.uid);
    const userPostsRef = collection(documentRef, "user_posts");

    // console.log("userPostsRef:", userPostsRef);

    // Use the query function to create a query with ordering
    const orderedQuery = query(userPostsRef, orderBy("createdAt"));

    // Get the documents from query
    const querySnapshots = await getDocs(orderedQuery);

    try {
      const posts = querySnapshots.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });

      // console.log(posts);
      dispatch({ type: USER_POST_STATE_CHANGE, posts });
    } catch (e) {
      console.log("Error fetching the data", e);
    }
  };
};

export const fetchUserFollowing = () => {
  return async (dispatch) => {
    const userCollection = collection(db, "following");
    const documentRef = doc(userCollection, auth.currentUser.uid);
    const userFollowersCollectionRef = collection(documentRef, "userFollowing");

    // Set up a snapshot listener to get real-time updates
    const unsubscribe = onSnapshot(userFollowersCollectionRef, (snapshot) => {
      const following = snapshot.docs.map((doc) => {
        // Assuming each document contains a 'followed' field
        const id = doc.id;
        return id;
      });
      // console.log("Following", following);
      dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
      for (let i = 0; i < following.length; i++) {
        dispatch(fetchUsersData(following[i], true));
      }
    });
  };
};

export const fetchUserFollowers = (uid) => {
  return async (dispatch) => {
    try {
      const userFollowersCollectionRef = collection(
        db,
        `followers/${uid}/userFollowers`
      );

      //Setting up snapshots to get real-time updates
      const unsubscribe = onSnapshot(userFollowersCollectionRef, (snapshot) => {
        const followers = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });

        dispatch({ type: USER_FOLLOWERS_STATE_CHANGE, followers });
      });
    } catch (error) {
      console.log("Error at fetching different user's followers list", error);
    }
  };
};

export const fetchUsersData = (uid, getPosts) => {
  return async (dispatch, getState) => {
    console.log(uid);
    const found = getState().usersState.users.some((el) => el.uid === uid);
    console.log("Found", found);

    if (!found) {
      const userCollection = collection(db, "users");
      const docRef = doc(userCollection, uid);
      try {
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          let user = snapshot.data();
          user.uid = snapshot.id;

          console.log("Users", user);

          dispatch({ type: USERS_DATA_STATE_CHANGE, user });
        } else {
          console.log("does not exist");
        }

        if (getPosts) {
          dispatch(fetchUsersFollowingPosts(uid));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
};

export const fetchUsersFollowingPosts = (uid) => {
  return async (dispatch, getState) => {
    try {
      const userCollection = collection(db, "posts");
      const documentRef = doc(userCollection, uid);
      const userPostsRef = collection(documentRef, "user_posts");

      const orderedQuery = query(userPostsRef, orderBy("createdAt"));

      // Get the documents from query
      const querySnapshots = await getDocs(orderedQuery);

      const user = getState().usersState.users.find((el) => el.uid === uid);

      const posts = querySnapshots.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;

        return { id, ...data, user };
      });

      dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
      console.log("Following posts", posts);
      console.log(getState());
    } catch (e) {
      console.log("Error fetching the data", e);
    }
  };
};
