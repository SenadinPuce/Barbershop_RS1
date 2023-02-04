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
            CreateMap<AppointmentUpdateDto, Appointment>();

            CreateMap<AppointmentStatus, AppointmentStatusDto>().ReverseMap();
            CreateMap<Barber, BarberDto>().ForMember(x => x.FirstName, opt => opt.MapFrom(y => y.AppUser.FirstName))
                .ForMember(x => x.LastName, opt => opt.MapFrom(y => y.AppUser.LastName))
                .ForMember(x => x.PhoneNumber, opt => opt.MapFrom(y => y.AppUser.PhoneNumber))
                .ForMember(x => x.Email, opt => opt.MapFrom(y => y.AppUser.Email))
                .ForMember(x => x.DateOfBirth, opt => opt.MapFrom(y => y.AppUser.DateOfBirth))
                .ForMember(x => x.Photo, opt => opt.MapFrom(y => y.AppUser.Photo))
                .ForMember(x => x.Username, opt => opt.MapFrom(y => y.AppUser.UserName))
                .ForMember(x => x.Age, opt => opt.MapFrom(y => y.AppUser.DateOfBirth.CalculateAge())).ReverseMap();

            CreateMap<Client, ClientDto>()
                .ForMember(x => x.FirstName, opt => opt.MapFrom(y => y.AppUser.FirstName))
                .ForMember(x => x.LastName, opt => opt.MapFrom(y => y.AppUser.LastName))
                .ForMember(x => x.Email, opt => opt.MapFrom(y => y.AppUser.Email))
                .ForMember(x => x.PhoneNumber, opt => opt.MapFrom(y => y.AppUser.PhoneNumber))
                .ForMember(x => x.Photo, opt => opt.MapFrom(y => y.AppUser.Photo))
                .ForMember(x => x.Username, opt => opt.MapFrom(y => y.AppUser.UserName)).ReverseMap();

            CreateMap<BarberService, BarberServiceDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
            CreateMap<WorkingHours, WorkingHoursDto>().ReverseMap();
            CreateMap<CustomHours, CustomHoursDto>().ReverseMap();

            CreateMap<Message, MessageDto>()
                .ForMember(d => d.SenderPhotoUrl, o => o.MapFrom(s => s.Sender.Photo.Url))
                .ForMember(d => d.RecipientPhotoUrl, o => o.MapFrom(s => s.Recipient.Photo.Url));

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ?
                DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);

            CreateMap<EmailDto, Email>();

            CreateMap<Product, ProductToReturnDto>()
              .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
              .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
              .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
        }
    }
}