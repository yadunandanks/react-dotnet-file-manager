using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileManager.Api.DTOs;
using FileManager.Api.DTOs.Request;

namespace FileManager.Api.Services
{
    public interface IFileService
    {
        
        public Task<FileDto> SaveFileAsync(IFormFile fileName);
        public Task<FileDto> RenameAsync(int id, RenameFileRequest renameFileRequest);
        // public Task<List<FileDto>> GetAllAsync();
        public Task<FileDto> UpdateMetadataAsync(int id, UpdateMetadataRequest updateMetadataRequest);



        public Task<PagedResponse<FileDto>> GetAllAsync(int pageNumber, int pageSize,string search, string sortBy,string sortOrder);
        public Task<(byte[] Content, string ContentType, string FileName)?> GetFileContentAsync(int id);
        public Task<bool> DeleteAsync(int id);

    }
}