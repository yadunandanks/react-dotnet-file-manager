using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileManager.Api.DTOs.Request
{
    public class RenameFileRequest
    {
       public string NewFileName {get; set;}="";
    }
}