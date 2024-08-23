import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

const initialState = {
  users: [],
  usersFollowingLoaded: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        //   posts: action.posts
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        users: state.users.map((user) =>
          user.uid === action.uid
            ? {
                ...user,
                posts: action.posts,
              }
            : user
        ),
      };
    case USERS_LIKES_STATE_CHANGE:
      return {
        ...state,
        users: state.users.map((user) => {
          user.uid === action.uid
            ? {
                ...user,
                likes: action.likes,
              }
            : user;
        }),
      };

    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};
