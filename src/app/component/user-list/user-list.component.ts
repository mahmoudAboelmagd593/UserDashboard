import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, finalize, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { selectAllUsers, selectLoading, selectTotal, selectTotalPages } from '../../Services/store/selectors/user.selectors';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../interface/User';
import { loadData } from '../../Services/store/actions/user.actions';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HoverBackgroundDirective } from '../../directives/hover-background.directive';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from "../../layout/header/header.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatLabel,
    HoverBackgroundDirective,
    MatTableModule, MatIconModule,
    HeaderComponent
],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000)
      ])
    ])
  ],
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;
  totalPages$!: Observable<number>;
  page: number = 1;
  pageSize: number = 6;
  total$!: Observable<number>;
  displayedColumns: string[] = [ 'id','avatar', 'first_name', 'last_name', 'email', 'actions'];
  private userCache = new Map<number, User>();  // Cache for individual users

  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  searchControl = new FormControl();
  private store =  inject(Store)
  private router =  inject(Router)
  constructor() {}
  ngOnInit(): void {
    this.loadUsers();
    this.loading$ = this.store.select(selectLoading);

    this.store.select(selectAllUsers).pipe(
      finalize(() => {
        console.log('Finalizing subscription');
      })
    ).subscribe(users => {
      this.dataSource.data = users;
      users.forEach(user => {
        this.userCache.set(user.id, user);
      });
    });

    this.total$ = this.store.select(selectTotal);
    this.dataSource.paginator = this.paginator;
    

  }

  loadUsers(): void {
    this.store.dispatch(loadData({ page: this.page }));
  }
    searchUserById(searchTerm: number): Observable<any> {
      const cachedUser = this.userCache.get(searchTerm);
      if (cachedUser) {
        // If the user is found in the cache, navigate to the user's details page
        this.router.navigate(['/user', cachedUser.id]);
        return new Observable(); 
      } else {
        // If the user is not found in the cache, search in the dataSource
        const user = this.dataSource.data.find(user => user.id == searchTerm);
        if (user) {
          this.router.navigate(['/user', user.id]);
        } else {
          // If not found in the dataSource, you might want to handle it (e.g., show a message)
          this.router.navigate(['/user', searchTerm]);
          console.log('User not found');
        }
        return new Observable();
      }
    }


  onSearchTermChanged(searchTerm: number): void {
    this.searchUserById(searchTerm);
  }
  goToPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}
