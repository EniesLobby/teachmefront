import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
    // {responseType: 'text'}
    getTree(nodeId: any) {
        return this.http.get(this.Url + 'getTreeCT?id=' + nodeId, {responseType: 'text'});
    }

    EditNode(node: any) {
        
        return this.http.put(this.Url + "node/" + node.id, node, httpOptions);
    }

    deleteNode(nodeId: any) {
        return this.http.delete(this.Url + "deleteNode/" + nodeId, httpOptions).subscribe();
    }

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

    createTree() {
        return this.http.post(this.Url + "createTree", "", httpOptions);
    }

    getChildren(nodeId: any) {
        return this.http.get(this.Url + 'node/' + nodeId + '/children', {responseType: 'text'});
    }

    getInformation(nodeId: any) {
        return this.http.get(this.Url + 'node/information/' + nodeId + '/');
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
}