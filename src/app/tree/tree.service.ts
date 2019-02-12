import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
                              responseType: 'text' })
};

@Injectable({ providedIn: 'root' })
export class TreeService {

    private subject = new BehaviorSubject<any>("question");

    sendMessage(message: string, data: any) {
        
        this.clearMessage();
        this.subject.next({ text: message, data: data });
    }
 
    clearMessage() {
        
        this.subject.next("");
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    
    constructor(private http:HttpClient) {  
    
    }
    
    Url = 'http://localhost:8080/nodes/';

    getNode(nodeId: any) {
        
        return this.http.get(this.Url + 'node/' + nodeId, { responseType: 'text' });
    }
    
    // {responseType: 'text'}
    getTree(nodeId: any) {
        
        return this.http.get(this.Url + 'getTreeCT?id=' + nodeId,  { responseType: 'text' });
    }

    getUser(email: string) {
        
        return this.http.get(this.Url + 'user/' + email, { responseType: 'text' })
    }

    setTitle(rootId: any, title: any) {
        
        let body = {
            "title": title
        }

        return this.http.post(this.Url + 'title/' + rootId, body, httpOptions);
    }

    EditNode(node: any, nodeId: any) {
        
        if(nodeId == null) {
            return this.http.put(this.Url + "node/" + node.id, node, httpOptions);
        } else {
            if(node.nodeId == undefined) {
                return this.http.put(this.Url + "node/" + node.id, node, httpOptions);
            }
            return this.http.put(this.Url + "node/" + node.nodeId, node, httpOptions);
        }
    }

    deleteNode(nodeId: any) {
        
        return this.http.delete(this.Url + "node/delete/" + nodeId, httpOptions);
    }

    deleteRootId(rootId: any, email: any) {
        
        return this.http.delete(this.Url + "tree/delete/" + rootId + "/user/" + email);
    }

    // /tree/delete/{rootId}/user/{email}

    deleteAnswer(nodeId: any, answer_id: any) {
        
        return this.http.delete(this.Url + "/deleteAnswer/node/" + nodeId + "/answer/" + answer_id, httpOptions);
    }

    AddNode(node: any, id) {
        
        let body = JSON.stringify(node);
        let received_id;

        return this.http.post(this.Url + "node/add/" + id, body, httpOptions).toPromise().then(
            data => {
                received_id = data;
                return data;
            }
        );
    }

    addUser(email: string, name: string, password: string) {
        
        let body = {
            "email": email,
            "name": name,
            "password": password
        }

        return this.http.post(this.Url + "/user/", body, httpOptions);
    }

    addRoot(email: string, rootId: string) {
        
        let body = {
            "rootId": rootId
        }

        return this.http.post(this.Url + "/user/addroot/" + email, body, httpOptions)
    }

    checkUser(email: string, password: string) {
        
        let body = {
            "email": email,
            "password": password
        }
        
        return this.http.post(this.Url + "user/login", body, httpOptions);
    }

    createTree() {
        
        return this.http.post(this.Url + "createTree", "", httpOptions);
    }

    getChildren(nodeId: any) {
        
        return this.http.get(this.Url + 'node/' + nodeId + '/children', {responseType: 'text' });
    }

    getInformation(nodeId: any) {
        
        return this.http.get(this.Url + 'node/information/' + nodeId + '/');
    }

    getInformationOne(nodeId: any): Observable<any> {
        
        return this.http.get(this.Url + 'node/information_one/' + nodeId + '/');
    }

    getSpecificInformation(nodeId: any): Observable<any> {
        return this.http.get(this.Url + 'node/informationspec/' + nodeId + '/');
    }

    async updateInformation(nodeId: any, answer_id: any, notes: string, information: string) {

        let payLoad = {
            "answer_id": answer_id,
            "information": information,
            "notes": notes
        };

        await this.http.post(this.Url + "node/information/add/"+ nodeId +"/answer/", payLoad, httpOptions).toPromise();
    }

    deleteAllNodes() {
        
        this.http.delete(this.Url + "deleteAll/", httpOptions).subscribe(
            val => {
                console.log("DELETE call successful value returned in body", 
                            val);
            },
            response => {
                console.log("DELETE call in error", response);
            },
            () => {
                console.log("The DELETE observable is now completed.");
            });
    }

    setViewed(email: any) {
        return this.http.post(this.Url + "/user/viewed/" + email, httpOptions)
    }
}