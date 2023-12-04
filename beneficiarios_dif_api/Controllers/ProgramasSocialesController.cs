using beneficiarios_dif_api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace beneficiarios_dif_api.Controllers
{
    [Route("api/programas-sociales")]
    [ApiController]
    public class ProgramasSocialesController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public ProgramasSocialesController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProgramaSocial>>> GetProgramasSociales()
        {
            return await context.ProgramasSociales.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult> Post(ProgramaSocial dto)
        {

            context.Add(dto);
            await context.SaveChangesAsync();
            return Ok();

        }
    }
}
