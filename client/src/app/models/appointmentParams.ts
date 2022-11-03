import { BaseParams } from './baseParams';

export class AppointmentParams extends BaseParams {
  dateFrom: Date;
  dateTo: Date;

  constructor() {
    super();
  }
}
