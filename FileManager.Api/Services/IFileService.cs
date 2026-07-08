using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileManager.Api.DTOs;

namespace FileManager.Api.Services
{
    public interface IFileService
    {
        
        public Task<FileDto> SaveFileAsync(IFormFile fileName);
        // public Task<List<FileDto>> GetAllAsync();
        public Task<PagedResponse<FileDto>> GetAllAsync(int pageNumber, int pageSize,string search, string sortBy,string sortOrder);
        public Task<(byte[] Content, string ContentType, string FileName)?> GetFileContentAsync(int id);
        public Task<bool> DeleteAsync(int id);

    }
}