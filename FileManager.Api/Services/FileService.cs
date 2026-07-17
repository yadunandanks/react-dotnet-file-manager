using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileManager.Api.Data;
using FileManager.Api.DTOs;
using FileManager.Api.DTOs.Request;
using FileManager.Api.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace FileManager.Api.Services
{
    public class FileService: IFileService 


    {

        public readonly AppDbContext _db;
    private readonly string _storagePath;
    private static readonly string[] AllowedExtensions = { ".pdf", ".png", ".jpg", ".jpeg", ".docx", ".txt", ".csv", ".xlsx" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;

        public FileService( AppDbContext db, IWebHostEnvironment env)
        {
            _db=db;
            _storagePath=Path.Combine(env.ContentRootPath, "StoredFiles");
             Directory.CreateDirectory(_storagePath);

        }

        public async Task<FileDto> SaveFileAsync(IFormFile file)
        {
            
            if(file.Length==0) throw new Exception("file is empty");
             if (file.Length > MaxFileSizeBytes)
            throw new ArgumentException("File exceeds the 10MB limit.");
            var ext=Path.GetExtension(file.FileName).ToLowerInvariant();
             if (!AllowedExtensions.Contains(ext))
            throw new ArgumentException($"File type '{ext}' is not allowed.");
             var storedName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(_storagePath, storedName);
        await using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

         var metadata = new FileMetadata
        {
            OriginalFileName = file.FileName,
            StoredFileName = storedName,
            ContentType = file.ContentType,
            SizeInBytes = file.Length
        };
        _db.Files.Add(metadata);
        await _db.SaveChangesAsync();
         return new FileDto(metadata.Id, metadata.OriginalFileName, metadata.ContentType,
            metadata.SizeInBytes, metadata.UploadedAtUtc,metadata.Description,metadata.Category,metadata.Tags);

            
        }
       public async Task<PagedResponse<FileDto>> GetAllAsync(
    int pageNumber,
    int pageSize,
    string search,
    string sortBy,
    string sortOrder)
{
    if (pageNumber < 1)
        pageNumber = 1;

    if (pageSize < 1)
        pageSize = 10;

    // Count only the files matching the search text.
    // This ensures pagination reflects the filtered results.
    var totalCount = await _db.Files
        .Where(f => f.OriginalFileName.Contains(search))
        .CountAsync();

    var skip = (pageNumber - 1) * pageSize;
    var query = _db.Files
        .Where(f => f.OriginalFileName.Contains(search));

    if (sortBy == "FileName")
    {
        query = sortOrder == "asc"
            ? query.OrderBy(f => f.OriginalFileName)
            : query.OrderByDescending(f => f.OriginalFileName);
    }
    else if (sortBy == "SizeInBytes")
    {
        query = sortOrder == "asc"
            ? query.OrderBy(f => f.SizeInBytes)
            : query.OrderByDescending(f => f.SizeInBytes);
    }
    else 
    {
        query = sortOrder == "asc"
            ? query.OrderBy(f => f.UploadedAtUtc)
            : query.OrderByDescending(f => f.UploadedAtUtc);
    }

   
    var files = await query
        .Skip(skip)
        .Take(pageSize)
        .Select(f => new FileDto(
            f.Id,
            f.OriginalFileName,
            f.ContentType,
            f.SizeInBytes,
            f.UploadedAtUtc,
            f.Description,
            f.Category,
            f.Tags))
        .ToListAsync();

    var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

    return new PagedResponse<FileDto>
    {
        Items = files,
        PageNumber = pageNumber,
        PageSize = pageSize,
        TotalPages = totalPages,
        TotalCount = totalCount
    };
}
        public async Task<(byte[] Content, string ContentType, string FileName)?> GetFileContentAsync(int id)
        {
            var meta = await _db.Files.FindAsync(id);
            if (meta is null) return null;

            var fullPath = Path.Combine(_storagePath, meta.StoredFileName);
            if (!File.Exists(fullPath)) return null;

            var bytes = await File.ReadAllBytesAsync(fullPath);
            return (bytes, meta.ContentType, meta.OriginalFileName);

        }

      public async Task<FileDto> RenameAsync(int id, RenameFileRequest renameFileRequest)
        {
             

              var file= await _db.Files.FindAsync(id);   

              if(file==null)
            {
                 throw new KeyNotFoundException("File not found.");
            }       
            
            if (string.IsNullOrWhiteSpace(renameFileRequest.NewFileName))
{
    throw new ArgumentException("Filename cannot be empty.");
  
              
}


 var newName= renameFileRequest.NewFileName.Trim();

    bool exists= await _db.Files.AnyAsync(f=> f.Id!=id && f.OriginalFileName==newName);
    if (exists)
{
    throw new InvalidOperationException("A file with this name already exists.");
} 
        
                file.OriginalFileName = newName;
                await _db.SaveChangesAsync();

                return new FileDto (
                 file.Id,
                 file.OriginalFileName,
                 file.ContentType,
                 file.SizeInBytes,
                 file.UploadedAtUtc,
                 file.Description,
                 file.Category,
                 file.Tags

                );
                

        }

        public async Task<FileDto> UpdateMetadataAsync(int id, UpdateMetadataRequest updateMetadataRequest)
        {

              var file= await _db.Files.FindAsync(id);   

              if(file==null)
            {
                 throw new KeyNotFoundException("File not found.");
            } 

           if (updateMetadataRequest.Description != null)
    {
        file.Description = updateMetadataRequest.Description;
    }

    if (updateMetadataRequest.Tags != null)
    {
        file.Tags = updateMetadataRequest.Tags;
    }

    if (updateMetadataRequest.Category != null)
    {
        file.Category = updateMetadataRequest.Category;
    }   

    await _db.SaveChangesAsync();

    return new FileDto (
        file.Id,
        file.OriginalFileName,
        file.ContentType,
        file.SizeInBytes,
        file.UploadedAtUtc,
       file.Description,
       file.Tags,
       file.Category

    ) ;
            
        }


    
       





        public async Task<bool> DeleteAsync(int id) {
            var meta = await _db.Files.FindAsync(id);
            if (meta is null) return false;

            _db.Files.Remove(meta);
            await _db.SaveChangesAsync();
            return true;

        }
    }
    
}