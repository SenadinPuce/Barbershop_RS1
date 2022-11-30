import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Barber } from 'src/app/models/barber';
import { BarberServiceModel } from 'src/app/models/barberService';
import { Service } from 'src/app/models/service';
import { BarberService } from 'src/app/_services/barber.service';
import { ServiceService } from 'src/app/_services/service.service';
import { forkJoin } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-barber-edit',
  templateUrl: './barber-edit.component.html',
  styleUrls: ['./barber-edit.component.css'],
})
export class BarberEditComponent implements OnInit {
  barber: Barber;
  barberServices: Partial<BarberServiceModel>[];
  services: Service[];
  availableServices: Service[];
  uploader: FileUploader;
  loading: boolean;
  fileName: string;
  @ViewChild('editProfileForm') form: NgForm;

  constructor(
    private barberService: BarberService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private servicesService: ServiceService,
    private accountService: AccountService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeUploader();

    forkJoin({
      barber: this.loadBarber(),
      services: this.loadServices(),
    }).subscribe(({ barber, services }) => {
      this.barber = barber;
      this.barber.dateOfBirth = new Date(barber.dateOfBirth + 'Z');
      this.services = services;
      this.barberServices = barber.barberServices;
      this.setAvailableServices();
    });
  }

  initializeUploader() {
    var token: string;
    this.accountService.currentUser$.subscribe((x) => {
      token = x?.token;
      console.log('initialize uploader');
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
        this.barber.photo = JSON.parse(res);
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

  loadBarber() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    if (!id) {
      const username = this.route.snapshot.paramMap.get('username');
      return this.barberService.getByUsername(username);
    }
    return this.barberService.getById(id);
  }

  loadServices() {
    return this.servicesService.getServices();
  }

  updateProfile() {
    this.barber.barberServices = this.barberServices as BarberServiceModel[];
    this.barberService.put(this.barber).subscribe(
      (response) => {
        this.router.navigateByUrl('/barbers');
        this.toastr.success('Successfully edited the profile.');
      },
      (err) => this.toastr.error('Failed to update the profile.')
    );
  }

  cancel() {
    this.location.back();
  }

  removeService(serviceId) {
    this.barberServices = [
      ...this.barberServices.filter((x) => x.serviceId !== serviceId),
    ];
    this.setAvailableServices();
  }

  addService() {
    this.barberServices = [
      ...this.barberServices,
      {
        isNew: true,
        serviceId: this.availableServices[0].id,
        availableServices: this.availableServices,
        price: this.availableServices[0].defaultPrice,
      },
    ];
    this.setAvailableServices();
  }

  setServicePrice(barberService) {
    barberService.price = this.services.find(
      (x) => x.id === barberService.serviceId
    )?.defaultPrice;
  }

  setAvailableServices() {
    this.availableServices = this.services.filter(
      (x) => !this.barberServices.some((y) => y.serviceId === x.id)
    );
    if (this.form) this.form.control.markAsDirty();
  }
}
