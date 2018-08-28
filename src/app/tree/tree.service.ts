import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TreeService {
    
    constructor(private http:HttpClient) {  

    }

    Url = 'http://localhost:8080/nodes/';
    
    getTree() {
        return this.http.get(this.Url + 'getTreeCT?id=48');
    }

}