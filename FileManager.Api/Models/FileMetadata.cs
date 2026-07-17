using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileManager.Api.Models
{
    public class FileMetadata
    {
        public int Id { get; set; } 
        public string OriginalFileName { get; set; }="";
        public string StoredFileName { get; set; }="";
        public string ContentType { get; set; }="";
        public long SizeInBytes { get; set; }
    public DateTime UploadedAtUtc { get; set; } = DateTime.UtcNow;
    public string Description { get; set; }="";

    public string Tags { get; set; }="";

    public string Category { get; set; }="";

        

    }
}