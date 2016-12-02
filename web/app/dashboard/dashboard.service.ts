import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {User } from './user';
import {Shuttle} from './shuttle';
import { Headers, RequestOptions } from '@angular/http';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DashboardService {
    private baseURL = '/api/';

    constructor(private http: Http) {
        console.log("Made a service");
    }

    getUser(): Promise<User> {
        return this.http.get(this.baseURL + "current_user/")

            .toPromise()
            .then(response => response.json() as User)
            .catch(this.handleError);
    }
    getShuttles(): Promise<Shuttle[]> {
        return this.http.get(this.baseURL + "get_shuttles/")
            .toPromise()
            .then(response => response.json().data as Shuttle[])
            .catch(this.handleError);
    }
    signup(user:User,shuttle:Shuttle) {
      console.log(user);
        var data = {
          "id":shuttle._id,
          "numGuests":user.numGuests,
          "guestsOnly":user.guestsOnly
        }
        console.log(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post(this.baseURL + "signup_shuttle/",data,options).toPromise().then(res =>{
          console.log(res);
          shuttle.message = "" + res.status;
        } );
    }
    unsignup(user:User,shuttle:Shuttle){
      console.log(user);
        var data = {
          "id":shuttle._id,
          "numGuests":user.numGuests,
          "guestsOnly":user.guestsOnly
        }
        console.log(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post(this.baseURL + "unsignup_shuttle/",data,options).toPromise().then(res =>{
          console.log(res);
          shuttle.message = "" + res.status;
        } );
    }
    getusershuttles(user:User):Promise<Shuttle[]>{
      return this.http.get(this.baseURL + "get_user_shuttles/")
          .toPromise()
          .then(response => response.json() as Shuttle[] )
          .catch(this.handleError);
    }

    // private extractData(res: Response) {
    //     let body = res.json();
    //     console.log("extracting data");
    //     console.log(body);
    //     return body.data || {};
    // }


    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
