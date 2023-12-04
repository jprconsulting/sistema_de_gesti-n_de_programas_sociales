using AutoMapper;
using beneficiarios_dif_api.DTOs;
using beneficiarios_dif_api.Entities;

namespace beneficiarios_dif_api.Utilities
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            // source, destination
            CreateMap<UsuarioInsertDTO, Usuario>();

            CreateMap<Usuario, UsuarioDetailDTO>()
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.RolId, opt => opt.MapFrom(src => src.Rol.Id))
                .IncludeMembers(src => src.Rol);


            CreateMap<Rol, UsuarioDetailDTO>()
             .ForMember(dest => dest.RolId, opt => opt.MapFrom(src => src.Id));            

            CreateMap<Rol, RolDTO>();
            CreateMap<RolDTO, Rol>();

            CreateMap<Municipio, MunicipioDTO>();
        }
    }
}
