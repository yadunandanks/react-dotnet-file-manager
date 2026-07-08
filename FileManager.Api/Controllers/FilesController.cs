using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FileManager.Api.Services;
using FileManager.Api.DTOs;



namespace FileManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        
        private readonly IFileService _fileService;
        private readonly ILogger<FilesController> _logger;

        public FilesController(IFileService fileService, ILogger<FilesController> logger )
        {
            this._fileService=fileService;
            this._logger=logger;

        }

[HttpGet]
       public async Task<ActionResult> GetAll([FromQuery] int pageNumber=1,
       [FromQuery] int pageSize=10 , [FromQuery] string search="", [FromQuery] string sortBy = "UploadedAtUtc",
    [FromQuery] string sortOrder = "desc"  )
{
    var files = await _fileService.GetAllAsync(pageNumber,pageSize,search,sortBy,sortOrder);
    return Ok(files);
}


[HttpPost("upload")]
public async Task<IActionResult> Upload(IFormFile file)
    {
        try
        {
            var result = await _fileService.SaveFileAsync(file);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Upload failed");
            return StatusCode(500, new { message = "Something went wrong while uploading." });
        }
    }



[HttpGet("{id}/download")]

public async Task<IActionResult> Download(int id)
        {
            var result= await _fileService.GetFileContentAsync(id);
            if (result is null) return NotFound();

        var (content, contentType, fileName) = result.Value;
        return File(content, contentType, fileName);
            
        }




[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
        {
            var deleted= await _fileService.DeleteAsync(id);
            return deleted? NoContent() : NotFound();
            

        }


    }
}