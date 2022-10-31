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
            .ForMember(x => x.DateOfBirth, opt => opt.MapFrom(y => y.AppUser.DateOfBirth))
            .ForMember(x => x.Age, opt => opt.MapFrom(y => y.AppUser.DateOfBirth.CalculateAge()))
            .ForMember(x => x.Photo, opt => opt.MapFrom(y => y.AppUser.Photo));
            CreateMap<BarberDto, Barber>()
            .ForPath(x => x.AppUser.FirstName, opt => opt.MapFrom(y => y.FirstName))
            .ForPath(x => x.AppUser.LastName, opt => opt.MapFrom(y => y.LastName))
            .ForPath(x => x.AppUser.PhoneNumber, opt => opt.MapFrom(y => y.PhoneNumber))
            .ForPath(x => x.AppUser.Email, opt => opt.MapFrom(y => y.Email))
            .ForPath(x => x.AppUser.DateOfBirth, opt => opt.MapFrom(y => y.DateOfBirth))
            .ForPath(x => x.AppUser.Photo, opt => opt.MapFrom(x => x.Photo));
            CreateMap<Client, ClientDto>().ForMember(x => x.FirstName, opt => opt.MapFrom(y => y.AppUser.FirstName))
            .ForMember(x => x.LastName, opt => opt.MapFrom(y => y.AppUser.LastName))
            .ForMember(x => x.Email, opt => opt.MapFrom(y => y.AppUser.Email))
            .ForMember(x => x.PhoneNumber, opt => opt.MapFrom(y => y.AppUser.PhoneNumber))
            .ForMember(x => x.Photo, opt => opt.MapFrom(y => y.AppUser.Photo)).ReverseMap();
            CreateMap<BarberService, BarberServiceDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
        }
    }
}