import { Component, OnInit, ElementRef } from '@angular/core';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { HttpClient, HttpResponse } from '@angular/common/http';


const URL = 'http://localhost:4000/products';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public last_update;
  public uploader:FileUploader = new FileUploader({url: URL, itemAlias: 'products-icount'});
  constructor(private http: HttpClient, private el: ElementRef) { }

  ngOnInit() {
    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
         this.last_update = new Date(item['_file']['lastModified']);

     };

     
  }
  
 

  reloadPage() {
      window.location.reload();
  }
  upload() {
      debugger;
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#products-icount');
    //get the total amount of files attached to the file input.
        let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
        let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            //append the key name 'photo' with the first file in the element
                formData.append('products-icount', inputEl.files.item(0));
            //call the angular http method
            this.http
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
                .post(URL, formData).subscribe(
                    (res) => { console.log(res); window.location.reload(); }
                //map the success function and alert the response
                //  (success) => {
                //          console.log('success');
                //          window.location.reload();
                // },
                // (error) => {
                //   console.log(error);
                // }
                )
                }
        
       }

}