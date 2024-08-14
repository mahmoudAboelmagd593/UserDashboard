import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../interface/User';
import { loadData } from '../../Services/store/actions/user.actions';
import { selectLoading, selectSelectedUser } from '../../Services/store/selectors/user.selectors';
import { HeaderComponent } from "../../layout/header/header.component";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    HeaderComponent
],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user$!: Observable<User | null>;
  loading$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(loadData({ id }));
    this.user$ = this.store.select(selectSelectedUser);
    this.loading$ = this.store.select(selectLoading);
  }
  searchUserById(searchTerm: number): Observable<any> {
    this.router.navigate(['/user', searchTerm])
    this.store.dispatch(loadData({ id:searchTerm }));

    // Select the user details and loading state from the store
    this.user$ = this.store.select(selectSelectedUser);
    this.loading$ = this.store.select(selectLoading);
      return new Observable();
    
  }
  onSearchTermChanged(searchTerm: number): void {
    this.searchUserById(searchTerm);
  }
  goBack(): void {
    this.router.navigate(['/']);
  }
}
