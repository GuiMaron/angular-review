import { Component, OnInit } from '@angular/core'
import { of, BehaviorSubject, Observable, Observer, fromEvent, combineLatest } from 'rxjs'
import { filter, map, debounceTime, distinctUntilChanged  } from 'rxjs/operators'
import { UserInterface } from './user.type'

import { ApiService } from './api.service'
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  users = [
      { id: '1', name: 'Jack', isActive: true}
    , { id: '2', name: 'John', isActive: false}
    , { id: '3', name: 'Mike', isActive: true}
    ]

  shows$ : Observable<Object>
  users$        = of(this.users)
  userName$     = this.users$.pipe(map((users)  => users.map((user) => (user.name))))
  filteredUser$ = this.users$.pipe(map((users) => users.filter((user) => user.isActive)))

  user$ = new BehaviorSubject<{id: string, name: string} | null>(null)
  usersSubscription : Observer<Array<UserInterface>>
  userList : Observable<Array<UserInterface>>

  documentClick$ = fromEvent(document, 'click')
  searchChanged$:Observable<Event>

  searchField : FormControl

  data$ = combineLatest([
    this.users$
  , this.userName$
  , this.filteredUser$
  ]).pipe(
    map(([users, userNames, filteredUsers]) => 
    {
      console.debug('users', users)
      console.debug('userNames', userNames)
      console.debug('filteredUsers', filteredUsers)
      return { users, userNames, filteredUsers }
    })
  )

  


  constructor (private apiService : ApiService) {
    
  }



  ngOnInit() : void {

    this.searchField = new FormControl('', {updateOn: 'change'})

    this.users$.subscribe((users) => console.debug('users', users))
    this.filteredUser$.subscribe((filteredUsers) => console.debug('filteredUsers', filteredUsers))
    this.user$.subscribe((user) => console.debug('user', user))

    this.searchField.valueChanges.pipe(
      debounceTime(333)
    , distinctUntilChanged()
    , map((search : string) => this.apiService.getShows(search))
    ).subscribe((response) => this.shows$ = response)

    setTimeout(() => 
    {
      this.user$.next(this.users[0])
    }, 2000) 

    this.userList = this.apiService.getUsers()

    this.documentClick$.subscribe((event) => console.debug('event', event))

    console.debug('data', this.data$)
  }


  ngOnDestroy() : void {

  } 

}
