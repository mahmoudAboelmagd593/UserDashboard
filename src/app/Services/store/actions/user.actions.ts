import { createAction, props } from '@ngrx/store';

export const loadData = createAction('[User] Load Data', props<{ id?: number, page?: number }>());
export const loadDataSuccess = createAction('[User] Load Data Success', props<{ data: any, total?: number, totalPages?: number }>());
export const loadDataFailure = createAction('[User] Load Data Failure', props<{ error: string }>());
