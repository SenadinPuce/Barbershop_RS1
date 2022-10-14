using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;
using API.Extensions;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, AppUser>();

            CreateMap<AppointmentType, AppointmentTypeDto>()
            .ForMember(x => x.Services, y => y.MapFrom(z => z.AppointmentTypeServices.Select(q => q.Service)));
            CreateMap<AppointmentTypeDto, AppointmentType>();

            CreateMap<Service, ServiceDto>().ReverseMap();
            CreateMap<Appointment, AppointmentDto>().ReverseMap();
            CreateMap<AppointmentStatus, AppointmentStatusDto>().ReverseMap();
            CreateMap<Barber, BarberDto>().ForMember(x => x.FirstName, opt => opt.MapFrom(y => y.AppUser.FirstName))
            .ForMember(x => x.LastName, opt => opt.MapFrom(y => y.AppUser.LastName))
            .ForMember(x => x.PhoneNumber, opt => opt.MapFrom(y => y.AppUser.PhoneNumber))
            .ForMember(x => x.Email, opt => opt.MapFrom(y => y.AppUser.Email))
            .ForMember(x => x.PhotoUrl, opt => opt.MapFrom(y => y.AppUser.PhotoUrl))
            .ForMember(x => x.Age, opt => opt.MapFrom(y => y.AppUser.DateOfBirth.CalculateAge()));
            CreateMap<Client, ClientDto>().ForMember(x => x.FirstName, opt => opt.MapFrom(y => y.AppUser.FirstName))
            .ForMember(x => x.LastName, opt => opt.MapFrom(y => y.AppUser.LastName));
            CreateMap<BarberService, BarberServiceDto>().ReverseMap();
        }
    }
}