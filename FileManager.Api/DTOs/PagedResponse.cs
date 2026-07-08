using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileManager.Api.DTOs
{
    public class PagedResponse<T>
    {
        public List<T> Items{get; set;}= new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
         public int TotalCount { get; set; }
          public int TotalPages { get; set; }

        
    }
}