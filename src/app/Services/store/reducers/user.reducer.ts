import { createReducer, on } from '@ngrx/store';
import { loadData, loadDataSuccess, loadDataFailure } from '../actions/user.actions';

export interface UserState {
  users: any[];
  selectedUser: any | null;
  total: number;
  totalPages: number;
  error: string | null;
  loading: boolean;
}

export const initialState: UserState = {
  users: [],
  selectedUser: null,
  total: 0,
  totalPages: 0,
  error: null,
  loading: false,
};

export const userReducer = createReducer(
  initialState,
  on(loadData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadDataSuccess, (state, { data, total, totalPages }) => ({
    ...state,
    users: Array.isArray(data) ? data : state.users,
    selectedUser: !Array.isArray(data) ? data : state.selectedUser,
    total: total !== undefined ? total : state.total,
    totalPages: totalPages !== undefined ? totalPages : state.totalPages,
    loading: false
  })),
  on(loadDataFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
