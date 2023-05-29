import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Login } from './login';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loginQuery: QueryRef<{login: Login}, {username: string}>;
  constructor(private apollo: Apollo) {
    this.loginQuery = this.apollo.watchQuery({
      query: gql`query login($username: String!) {
        login(username:$username){
          password
          customer_id
        }
      }`
    });
  }

  async getLogin(username: string): Promise<Login> {
    const result = await this.loginQuery.refetch({ username });
    return result.data.login;
  }
}
