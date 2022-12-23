import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit, OnDestroy {
  @ViewChild('clientTabs', {static: true}) clientTabs: TabsetComponent;
  activeTab: TabDirective | undefined;
  user: User;
  client: User;

  constructor(private accountService: AccountService, private route: ActivatedRoute, 
    private messageService: MessageService, private router: Router) {
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
        this.client = data['client'];
      }
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    })
  }

  selectTab(heading: string) {
    if(this.clientTabs && this.user) {
      this.clientTabs.tabs.find(x => x.heading === heading).active = true;
      this.messageService.createHubConnection(this.user, this.client.username);
    }
  }



}
