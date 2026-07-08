using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileManager.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FileManager.Api.Data
{
    public class AppDbContext :DbContext
    {
         public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<FileMetadata> Files => Set<FileMetadata>();


    }
}