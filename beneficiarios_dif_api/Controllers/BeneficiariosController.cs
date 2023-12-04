using beneficiarios_dif_api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace beneficiarios_dif_api.Controllers
{
    [Route("api/beneficiarios")]
    [ApiController]
    public class BeneficiariosController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public BeneficiariosController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Beneficiario>>> GetBeneficiarios()
        {
            return await context.Beneficiarios.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult> Post(Beneficiario dto)
        {

            context.Add(dto);
            await context.SaveChangesAsync();
            return Ok();

        }
    }
}
