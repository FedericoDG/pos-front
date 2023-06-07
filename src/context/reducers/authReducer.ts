import { ActionType, Actions } from '../../interfaces';

export const authReducer = (state: any, action: Actions) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {
        ...action.payload,
        logged: true,
      };
    case ActionType.LOGOUT:
      return {
        logged: false,
      };
    default:
      return state;
  }
};
