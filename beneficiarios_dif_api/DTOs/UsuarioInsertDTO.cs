namespace beneficiarios_dif_api.DTOs
{
    public class UsuarioInsertDTO
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Correo { get; set; }
        public string Password { get; set; }
        public bool Estatus { get; set; }
        public int RolId { get; set; }
    }
}
