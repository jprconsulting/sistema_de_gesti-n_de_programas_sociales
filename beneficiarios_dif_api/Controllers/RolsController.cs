using AutoMapper;
using beneficiarios_dif_api.DTOs;
using beneficiarios_dif_api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace beneficiarios_dif_api.Controllers
{
    [Route("api/rols")]
    [ApiController]
    public class RolsController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;

        public RolsController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<RolDTO>>> GetRols()
        {

            var rols = await context.Rols.ToListAsync();
            return mapper.Map<List<RolDTO>>(rols);
        }

        [HttpPost]
        public async Task<ActionResult> Post(RolDTO dto)
        {
            var existeRol = await context.Rols.AnyAsync(r => r.NombreRol == dto.NombreRol);

            if (existeRol)
            {
                return BadRequest();
            }

            var rol = mapper.Map<Rol>(dto);
            context.Add(rol);
            await context.SaveChangesAsync();
            return Ok();

        }
    }
}
