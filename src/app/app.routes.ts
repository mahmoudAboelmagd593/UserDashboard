import { Routes } from '@angular/router';
import { UserListComponent } from './component/user-list/user-list.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';

export const routes: Routes = [
    { path: '', component: UserListComponent }, 
  { path: 'user/:id', component: UserDetailsComponent }, 
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];
