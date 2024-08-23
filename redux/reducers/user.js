import {
  USER_STATE_CHANGE,
  USER_POST_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  CLEAR_DATA,
  TOGGLE_VERIFICATION,
  USER_FOLLOWERS_STATE_CHANGE,
} from "../constants";

const initialState = {
  currentUser: null,
  posts: [],
  following: [],
  followers: [],
  emailVerified: false,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_POST_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };
    case USER_FOLLOWING_STATE_CHANGE:
      return {
        ...state,
        following: action.following,
      };

    case USER_FOLLOWERS_STATE_CHANGE:
      return {
        ...state,
        followers: action.followers,
      };

    case TOGGLE_VERIFICATION:
      return {
        ...state,
        emailVerified: action.emailVerified,
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
