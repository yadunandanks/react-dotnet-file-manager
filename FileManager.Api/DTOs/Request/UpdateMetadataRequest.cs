using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileManager.Api.DTOs.Request
{
    public class UpdateMetadataRequest
    {
     public string Description{get; set;}="";
    public string Tags{get; set;}="";
    public string Category{get; set;}="";

    }
}