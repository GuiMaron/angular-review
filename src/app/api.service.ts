import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs' 
import { map } from 'rxjs/operators' 
import { UserInterface } from './user.type'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient : HttpClient) { 

  }

  public getUsers() : Observable<Array<UserInterface>> {
    return (this.httpClient.get('https://jsonplaceholder.typicode.com/users').pipe(
      map((response) =>(response as Array<Object>).map((item) => item as UserInterface))
    ))
  }

}
