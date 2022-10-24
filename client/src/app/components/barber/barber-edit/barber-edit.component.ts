import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Barber } from 'src/app/models/barber';
import { BarberServiceModel } from 'src/app/models/barberService';
import { Service } from 'src/app/models/service';
import { BarberService } from 'src/app/_services/barber.service';
import { ServiceService } from 'src/app/_services/service.service';
import { forkJoin } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
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

  constructor(
    private barberService: BarberService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private servicesService: ServiceService
  ) {
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.response.subscribe(
      (res) => (this.barber.photo = JSON.parse(res))
    );
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  ngOnInit(): void {
    forkJoin({
      barber: this.loadBarber(),
      services: this.loadServices(),
    }).subscribe(({ barber, services }) => {
      this.barber = barber;
      this.barber.dateOfBirth = new Date(barber.dateOfBirth + 'Z');
      this.services = services;
      this.barberServices = barber.barberServices;
      this.uploader.options.url =
        environment.apiUrl + 'barbers/' + this.barber.id + '/add-photo';
      this.setAvailableServices();
    });
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
        this.ngOnInit();
        this.toastr.success('Successfully edited the profile.');
      },
      (err) => this.toastr.error('Failed to update the profile.')
    );
  }

  cancel() {
    this.ngOnInit();
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
  }
}
