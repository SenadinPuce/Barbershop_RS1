import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Client } from 'src/app/models/client';
import { Address, User } from 'src/app/models/user';
import { AccountService } from 'src/app/_services/account.service';
import { ClientService } from 'src/app/_services/client.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  client: Client;
  uploader: FileUploader;
  loading: boolean;
  fileName: string;
  user: User;
  address: Address;
  @ViewChild('editProfileForm') form: NgForm;
  @ViewChild('editAddressForm') address_form: NgForm;


  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }



  ngOnInit(): void {
    this.initializeUploader();
    this.loadClient().subscribe({
      next: response => 
      {
        this.client = response
        this.client.dateOfBirth = new Date(response.dateOfBirth);
      }
    });
    this.getAddress();
  }
  
  initializeUploader() {
    var token: string;
    this.accountService.currentUser$.subscribe((x) => {
      token = x?.token;
    });
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: true,
      maxFileSize: 10 * 1024 * 1024,
      authToken: `Bearer ${token}`,
      url: environment.apiUrl + 'barbers/add-photo',
    });

    this.uploader.response.subscribe((res) => {
      this.loading = false;
      try {
        this.user.photo = JSON.parse(res);
        this.client.photo = JSON.parse(res);
      } catch {
        this.toastr.error(res);
      }
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.loading = true;
      this.fileName = file._file.name;
      this.form.control.markAsDirty();
    };
  }

  loadClient() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    if (!id) {
      const username = this.route.snapshot.paramMap.get('username');
      return this.clientService.getByUsername(username);
    }
    return this.clientService.getById(id);
  }

  updateProfile() {
    if(this.address_form.dirty) {
      this.accountService.updateUserAddress(this.address).subscribe({
        next: () => {
          this.address_form.resetForm(this.address);
          this.toastr.success('Successfully changed the address');
        }
      })
    }
    if(this.form.dirty) {
    this.clientService.put(this.client).subscribe(
      (response) => {
        this.form.resetForm(this.client);
        this.toastr.success('Successfully edited the profile.');
        this.accountService.setCurrentUser(this.user);
      },
      (err) => this.toastr.error('Failed to update the profile.')
    );
    }
  }

  getAddress() {
    this.accountService.getUserAddress().subscribe({
      next: address => {
        this.address = address;
      }
    })
  }

}
