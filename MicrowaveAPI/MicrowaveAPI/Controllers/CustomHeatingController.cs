using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using System.ComponentModel.DataAnnotations;

namespace MicrowaveAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomHeatingController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        public CustomHeatingController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        private const string JsonFileName = "heating-programs.json";

        // GET all the heating programs
        [HttpGet]
        public IActionResult Get()
        {
            string jsonFilePath = Path.Combine(_hostingEnvironment.ContentRootPath, "App_Data", JsonFileName);

            if (System.IO.File.Exists(jsonFilePath))
            {
                string jsonData = System.IO.File.ReadAllText(jsonFilePath);
                var predefinedValues = JsonSerializer.Deserialize<List<PredefinedValue>>(jsonData);

                // Put the array in an object for better visualization
                var result = new PredefinedValuesResponse
                {
                    PredefinedValues = predefinedValues
                };

                return Ok(result);
            }

            return NotFound();
        }

        [HttpPost("add")]
        public IActionResult AddNewProgram([FromBody] PredefinedValue predefinedValue)
        {
            string jsonFilePath = Path.Combine(_hostingEnvironment.ContentRootPath, "App_Data", JsonFileName);

            if (System.IO.File.Exists(jsonFilePath))
            {
                // Load json file
                string jsonData = System.IO.File.ReadAllText(jsonFilePath);
                var predefinedValues = JsonSerializer.Deserialize<List<PredefinedValue>>(jsonData);

                // Verify if there is already the same 'caracterAquecimento'
                if (predefinedValues.Any(p => p.CaracterAquecimento == predefinedValue.CaracterAquecimento))
                {
                    return BadRequest(new { message = "O caractere de aquecimento já está sendo utilizado." });
                }
                if (predefinedValue.CaracterAquecimento == ".")
                {
                    return BadRequest(new { message = "O caractere de aquecimento não pode ser '.' (ponto)." });
                }

                // Get last id
                int highestId = predefinedValues.Max(p => p.Id);

                // Generate new id
                int newId = highestId + 1;

                predefinedValue.Id = newId;
                predefinedValue.Editable = true;

                // Add to the list (json)
                predefinedValues.Add(predefinedValue);

                // Convert to json
                string updatedJsonData = JsonSerializer.Serialize(predefinedValues);

                // Write in the json
                System.IO.File.WriteAllText(jsonFilePath, updatedJsonData);

                return Ok(new { predefinedValue });
            }

            return NotFound();
        }

        [HttpDelete("{id}")]
        public IActionResult RemoveProgram(int id)
        {
            string jsonFilePath = Path.Combine(_hostingEnvironment.ContentRootPath, "App_Data", JsonFileName);
            if (System.IO.File.Exists(jsonFilePath))
            {
                string jsonData = System.IO.File.ReadAllText(jsonFilePath);
                var predefinedValues = JsonSerializer.Deserialize<List<PredefinedValue>>(jsonData);

                var predefinedValueToRemove = predefinedValues.FirstOrDefault(p => p.Id == id);
                if (predefinedValueToRemove != null)
                {
                    predefinedValues.Remove(predefinedValueToRemove);

                    string updatedJsonData = JsonSerializer.Serialize(predefinedValues);
                    System.IO.File.WriteAllText(jsonFilePath, updatedJsonData);

                    return NoContent();
                }

                return NotFound();
            }

            return NotFound();
        }

    }
}
public class PredefinedValue
{
    public int Id { get; set; }
    [Required(ErrorMessage = "O campo Nome é obrigatório.")]
    public string Nome { get; set; }
    [Required(ErrorMessage = "O campo Alimento é obrigatório.")]
    public string Alimento { get; set; }
    [Required(ErrorMessage = "É necessário informar o tempo.")]
    public int Time { get; set; }
    [Range(1, 10, ErrorMessage = "A Potência precisa ser um valor válido entre 1 e 10.")]
    public int Power { get; set; }
    public string Instrucoes { get; set; }
    public bool Editable { get; set; }
    [Required(ErrorMessage = "O campo do Caracter de Aquecimento é obrigatório.")]
    public string CaracterAquecimento { get; set; }
}

public class PredefinedValuesResponse
{
    public List<PredefinedValue> PredefinedValues { get; set; }
}