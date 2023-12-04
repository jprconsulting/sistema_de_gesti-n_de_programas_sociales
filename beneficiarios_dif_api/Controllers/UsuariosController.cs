using AutoMapper;
using beneficiarios_dif_api.DTOs;
using beneficiarios_dif_api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace beneficiarios_dif_api.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public UsuariosController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<UsuarioDetailDTO>> GetById(int id)
        {
            var usuario = await context.Usuarios.Include(i => i.Rol).FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null) 
            {
                return NotFound();            
            }

            return mapper.Map<UsuarioDetailDTO>(usuario);
        }


        [HttpGet]
        public async Task<ActionResult<List<UsuarioDetailDTO>>> GetUsuarios()
        {
            var usuarios = await context.Usuarios.Include(i => i.Rol).ToListAsync();
            return mapper.Map<List<UsuarioDetailDTO>>(usuarios);
        }

        [HttpPost]
        public async Task<ActionResult> Post(UsuarioInsertDTO dto)
        {
            var existeUsuario = await context.Usuarios.AnyAsync(u => u.Nombre == dto.Nombre && u.ApellidoPaterno == dto.ApellidoPaterno);

            if (existeUsuario) 
            {
                return BadRequest();
            }

            var usuario = mapper.Map<Usuario>(dto);
            usuario.Rol = await context.Rols.SingleOrDefaultAsync(r => r.Id == dto.RolId);

            context.Add(usuario);
            await context.SaveChangesAsync();
            return Ok();

        }
    }
}
