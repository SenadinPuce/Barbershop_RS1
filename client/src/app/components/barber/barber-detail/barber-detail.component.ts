import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/common/modal/confirm-modal/confirm-modal.component';
import { Barber } from 'src/app/models/barber';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BarberService } from 'src/app/_services/barber.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-barber-detail',
  templateUrl: './barber-detail.component.html',
  styleUrls: ['./barber-detail.component.css'],
  providers: [BsModalRef, BsModalService],
})
export class BarberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('barberTabs', {static: true}) barberTabs: TabsetComponent;
  activeTab: TabDirective;
  barber: Barber;
  deleteModalRef: BsModalRef;
  user: User;

  constructor(
    private barberService: BarberService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user;
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {

  this.route.data.subscribe({
    next: data => {
      this.barber = data['barber'];
    }
  })

   this.route.queryParams.subscribe({
    next: params => {
      params['tab'] && this.selectTab(params['tab']);
    }
   })
  }

  selectTab(heading: string) {
    if(this.barberTabs) {
      this.barberTabs.tabs.find(x => x.heading === heading).active = true;
    }
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

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this?.user && this?.barber.username) {
      this.messageService.createHubConnection(this.user, this.barber.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
