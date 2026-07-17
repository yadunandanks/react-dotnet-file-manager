using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileManager.Api.DTOs
{
    public record FileDto
    (int Id,
        string FileName,
        string  ContentType,
        long SizeInBytes,
        DateTime UploadedAtUtc,
        string Description,
    string Tags,
    string Category
        
         );
        
}