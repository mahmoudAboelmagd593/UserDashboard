import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../user.service';
import { loadData, loadDataSuccess, loadDataFailure } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  private userCache = new Map<number, any>();  // Cache for individual users
  private userListCache = new Map<number, any[]>();  // Cache for user lists by page number

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData),
      mergeMap(action => {
        if (action.page !== undefined) {
          // Ensure that page is a number
          const page = action.page!;
          // Check if the user list for the page is already cached
          const cachedUserList = this.userListCache.get(page);
          if (cachedUserList) {
            return of(loadDataSuccess({ data: cachedUserList, totalPages: this.calculateTotalPages(), total: this.calculateTotalUsers() }));
          } else {
            // Fetch user list when `page` is specified and not cached
            return this.userService.getUsers(page).pipe(
              map(response => {
                this.userListCache.set(page, response.data);  // Cache the user list
                return loadDataSuccess({ data: response.data, totalPages: response.total_pages, total: response.total });
              }),
              catchError(error => of(loadDataFailure({ error: error.message })))
            );
          }
        } else if (action.id !== undefined) {
          // Ensure that id is a number
          const id = action.id!;
          // Fetch user details when `id` is specified, using caching to avoid redundant requests
          const cachedUser = this.userCache.get(id);
          if (cachedUser) {
            return of(loadDataSuccess({ data: cachedUser }));
          } else {
            return this.userService.getUserById(id).pipe(
              map(response => {
                this.userCache.set(id, response.data); // Cache the user details
                return loadDataSuccess({ data: response.data });
              }),
              catchError(error => of(loadDataFailure({ error: error.message })))
            );
          }
        } else {
          // Handle invalid action parameters where both `id` and `page` are undefined
          return of(loadDataFailure({ error: 'Invalid action parameters' }));
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  private calculateTotalPages(): number {
    // Implement logic to calculate total pages based on cached data
    // This is a placeholder example
    return this.userListCache.size;
  }

  private calculateTotalUsers(): number {
    // Implement logic to calculate total users based on cached data
    // This is a placeholder example
    let totalUsers = 0;
    this.userListCache.forEach(users => {
      totalUsers += users.length;
    });
    return totalUsers;
  }
}
