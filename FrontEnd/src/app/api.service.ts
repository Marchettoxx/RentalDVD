import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Login, Films } from './typeDB';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loginQuery: QueryRef<{login: Login}, {username: string}>;
  private filmsQuery: QueryRef<{films: Films}, {offset: number}>;
  constructor(private apollo: Apollo) {
    this.loginQuery = this.apollo.watchQuery({
      query: gql`query login($username: String!) {
        login(username:$username){
          password
          customer_id
        }
      }`
    });
    this.filmsQuery = this.apollo.watchQuery({
      query: gql`query films($offset: Int!){
        films(offset: $offset){
          count
          film {
            title
          }
        }
      }`
    });
  }

  async getLogin(username: string): Promise<Login> {
    const result = await this.loginQuery.refetch({ username });
    return result.data.login;
  }

  async getFilms(offset: number): Promise<Films> {
    const result = await this.filmsQuery.refetch({ offset });
    return result.data.films;
  }

}
