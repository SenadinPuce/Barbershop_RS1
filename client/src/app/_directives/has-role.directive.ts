import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string;

  constructor(
    private accountService: AccountService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe((user) => {
      if (!user || user.role === '') {
        this.viewContainerRef.clear();
        return;
      }
      const roles = this.appHasRole.split(',');
      if (roles.some((role) => user.role === role)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
