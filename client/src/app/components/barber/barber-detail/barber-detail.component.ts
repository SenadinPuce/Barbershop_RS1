import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from 'src/app/common/modal/confirm-modal/confirm-modal.component';
import { Barber } from 'src/app/models/barber';
import { BarberService } from 'src/app/_services/barber.service';

@Component({
  selector: 'app-barber-detail',
  templateUrl: './barber-detail.component.html',
  styleUrls: ['./barber-detail.component.css'],
  providers: [BsModalRef, BsModalService],
})
export class BarberDetailComponent implements OnInit {
  barber: Barber;
  deleteModalRef: BsModalRef;

  constructor(
    private barberService: BarberService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBarber();
  }

  loadBarber() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.barberService.getById(id).subscribe((data) => {
      this.barber = data;
    });
  }

  onDelete(barberId) {
    this.deleteModalRef = this.modalService.show(ConfirmModalComponent, {
      animated: false,
      class: 'modal-dialog-centered',
      initialState: {
        question: 'Are you sure you want to delete the barber?',
      },
    });
    this.deleteModalRef.onHide.subscribe(() => {
      if (this.deleteModalRef.content?.message === 'confirmed') {
        this.deleteBarber(barberId);
      }
    });
  }

  deleteBarber(id) {
    this.barberService.delete(id).subscribe(() => {
      this.toastr.info('Barber deleted sucessfully.');
      this.router.navigateByUrl('/barbers');
    });
  }
}
