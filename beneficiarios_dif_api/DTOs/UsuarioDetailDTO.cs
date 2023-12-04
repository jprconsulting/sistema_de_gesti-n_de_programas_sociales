using System.ComponentModel.DataAnnotations;

namespace beneficiarios_dif_api.DTOs
{
    public class UsuarioDetailDTO : UsuarioInsertDTO
    {
        public int UsuarioId { get; set; }    
        public string NombreRol { get; set; }
    }
}
