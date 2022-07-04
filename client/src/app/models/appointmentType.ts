import { IService } from "./service";

export interface IAppointmentType {
    id: number,
    name: string,
    color: string,
    duration: number,
    services: IService[]
}