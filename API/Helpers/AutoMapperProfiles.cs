using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper;

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

        }
    }
}