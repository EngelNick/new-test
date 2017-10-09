import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { } from 'angular/http';

@Injectable()
export class JsonServiceService {

  options;
  localUser1 = '../../assets/files/user1.json';  // for local JSON files
  localUser2 =  '../../assets/files/user2.json'; // for local JSON files
  serverURL;

  constructor(
    private http: Http) { }

    createAuthenticationHeaders() {
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      });
    }

  getUser1JSON() {
    return this.http.get(this.localUser1).map(res => res.json());
  }

  getUser2JSON() {
    return this.http.get(this.localUser2).map(res => res.json());
  }

  postJSON(UserList1, UserList2) {
    this.createAuthenticationHeaders();
    const data1 = {items: UserList1};
    const data2 = {items: UserList2};
    const body = {user1: data1, user2: data2};
    const json = JSON.stringify(body);
    return this.http.put(this.serverURL, body, this.options).map(res => res.json());
  }

  createFileJSON(list) {
    this.createAuthenticationHeaders();
    const body = {items: list};
    const json = JSON.stringify(body);
    return this.http.post(this.serverURL, body, this.options).map(res => res.json());
  }

}
