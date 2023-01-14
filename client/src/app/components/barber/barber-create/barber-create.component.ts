import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Barber } from 'src/app/models/barber';
import { AccountService } from 'src/app/_services/account.service';
import { BarberService } from 'src/app/_services/barber.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-barber-create',
  templateUrl: './barber-create.component.html',
  styleUrls: ['./barber-create.component.css'],
})
export class BarberCreateComponent implements OnInit {
  barber: Partial<Barber> = {
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    phoneNumber: '',
    email: '',
  };
  uploader: FileUploader;
  loading: boolean;
  fileName: string;

  constructor(
    private barberService: BarberService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  onCreate() {
    this.barberService.post(this.barber).subscribe(() => {
      this.toastr.success('Barber created successfully.');
      this.router.navigateByUrl('/barbers');
    });
  }

  cancel() {
    this.location.back();
  }

  initializeUploader() {
    var token: string;
    this.accountService.currentUser$.subscribe((x) => (token = x.token));
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
        this.barber.photo = JSON.parse(res);
      } catch {
        this.toastr.error(res);
      }
    });

    this.uploader.onAfterAddingFile = (file) => {
      this.loading = true;
      file.withCredentials = false;
      this.fileName = file._file.name;
    };
  }
}
