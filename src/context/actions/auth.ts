import { ActionType, User } from '../../interfaces';

export const loginAction = (user: User) => ({ type: ActionType.LOGIN, payload: user });
export const logoutAction = () => ({ type: ActionType.LOGOUT });
