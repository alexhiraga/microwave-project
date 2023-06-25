using Microsoft.AspNetCore.Mvc;

namespace MicrowaveAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Microwave : ControllerBase
    {
        private static Timer timer;
        private static int remainingTime;
        private static int power = 10;
        private static bool isHeating = false;
        private static bool isPaused = false;
        private static string charHeat = ".";

        //Turning On the Microwave
        [HttpPost]
        public IActionResult StartMicrowave([FromBody] TimerRequest request)
        {
            // Resume Microwave heating
            if(isPaused && !isHeating)
            {
                isPaused = false;
                isHeating = true;
                timer.Change(TimeSpan.Zero, TimeSpan.FromSeconds(1));
                return Ok(new { message = "Aquecimento retomado." });
            }

            // Add +30s
            if(timer != null && isHeating && !isPaused)
            {
                if(request.CaracterAquecimento != ".")
                {
                    return BadRequest(new { message = "Não é possível acrescentar tempo ao utilizar um programa" });
                }
                remainingTime += 30;
                return Ok(new { message = "Foi acrescentado mais 30 segundos", remainingTime, power });
            }

            int time = request.Time;

            //Time validation
            if(request.CaracterAquecimento == ".")
            {
                if(time < 1 || time > 120)
                {
                    return BadRequest(new { message = "Tempo inválido, utilize valores de 1 segundo a 2 minutos." });
                }
            }

            //Power validation
            if (request.Power < 1 || request.Power > 10)
            {
                return BadRequest(new { message = "Potência inválida, utlize valores inteiros entre 1 e 10" });
            }
            else if(request.Power > 0 && request.Power <= 10)
            {
                power = (int)request.Power;
            }
            else
            {
                power = 10;
            }

            // Heating character validation
            if(request.CaracterAquecimento != null)
            {
                charHeat = request.CaracterAquecimento;
            }

            remainingTime = time;

            timer = new Timer(state =>
            {
                remainingTime--;
                if (remainingTime <= 0)
                {
                    timer.Dispose();
                    timer = null;
                }
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));

            isHeating = true;
            isPaused = false;

            return Ok(new { message = "O microondas foi ligado.", time, power });
        }

        // Quick start Power = 10 and Time = 30s
        [HttpPost("quickstartmicrowave")]
        public IActionResult QuickStartMicrowave()
        {
            if (timer != null || isPaused)
            {
                return BadRequest(new { message = "O Microondas já está ligado!" });
            }
            remainingTime = 30;
            power = 10;

            timer = new Timer(state =>
            {
                remainingTime--;
                if (remainingTime <= 0)
                {
                    timer.Dispose();
                    timer = null;
                }
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            isHeating = true;

            return Ok(new { message = "O microondas foi ligado.", remainingTime, power });
        }

        // Pause
        [HttpPost("pause")]
        public IActionResult PauseTimer()
        {
            // Case 1: Microwave is already paused. Heating will be cancelled and all values reseted
            if(isPaused && !isHeating)
            {
                remainingTime = 0;
                power = 0;
                charHeat = ".";
                isPaused = false;
                isHeating = false;
                timer = null;
                return Ok(new { message = "Aquecimento cancelado." });
            }

            // Case 2: Microwave is not heating and paused. Just return and clear values in front-end
            if(!isPaused && !isHeating)
            {
                return Ok(new { message = "O microondas não está ligado." });
            }

            // Just pause
            if(timer != null)
            {
                timer.Change(Timeout.Infinite, Timeout.Infinite);
                isHeating = false;
                isPaused = true;
                return Ok(new { message = "Aquecimento pausado." });
            }
            return Ok(new { message = "O Microondas está desligado."});
        }

        // Microwave timer
        [HttpGet]
        public IActionResult GetTimeRemaining()
        {
            int minutes = remainingTime / 60;
            int seconds = remainingTime % 60;
            string character = "";
            string charPower = "";

            for(int i = 0; i < power; i++)
            {
                charPower += charHeat;
            }
            for(int i = 0; i < remainingTime; i++)
            {
                character += charPower + " ";
            }

            if (remainingTime > 0)
            {
                return Ok(new { secondsRemaining = $"{minutes}:{seconds:D2}", power, message = character });
            }
            else if (remainingTime == 0)
            {
                return Ok(new { message = character + "Aquecimento concluído." });
            }
            else
            {
                return Ok();
            }
        }
    }

    public class TimerRequest
    {
        public int Time { get; set; }
        public int? Power { get; set; }
        public string? CaracterAquecimento { get; set; }
    }
}
