
import './App.css';
import Typography from "@mui/material/Typography";
import { Pagination } from "@mui/material";

import { useCallback, useEffect, useState } from "react";
// import { getFiles } from "./api/filesApi";
import { getFiles } from "./api/filesApi";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";

export default function App() {
  const[search,setSearch]= useState("");

const [debouncedSearch, setDebouncedSearch] = useState("");

  const[files,setFiles]=useState([]);
  const [pageNumber, setPageNumber] = useState(1);

const [pageSize] = useState(10);

const [totalPages, setTotalPages] = useState(1);
  const[loading,SetLoading]=useState(false);


  const LoadFiles = useCallback(async () => {
    SetLoading(true);

    const res = await getFiles(pageNumber, pageSize,debouncedSearch);

    setFiles(res.items);
    setTotalPages(res.totalPages);

    SetLoading(false);
}, [pageNumber, pageSize,debouncedSearch]);
 
  useEffect(() => {
    LoadFiles();
}, [LoadFiles]);


useEffect(()=> {
  const timer= setTimeout(()=> {
    setDebouncedSearch(search);
  },500)
   return () => clearTimeout(timer);
},[search])

  return (
   <div style={{maxWidth:800, margin: "40px auto", fontFamily: "sans-serif" }}>
   <Typography variant="h4">
    File Manager
</Typography>
<input
    type="text"
    placeholder="Search files..."
    value={search}
    onChange={(e) => {
        setSearch(e.target.value);
        setPageNumber(1);
    }}
    style={{
        width: "100%",
        padding: "12px",
        margin: "20px 0",
        fontSize: "16px"
    }}
/>
       <FileUpload onUploaded={LoadFiles} />
        {loading ? <p>Loading...</p> : <FileList files={files} onChanged={LoadFiles} />}
        <Pagination
      count={totalPages}
      page={pageNumber}
      onChange={(event, value) => setPageNumber(value)}
      disabled={loading}
      color="primary"
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "center",
      }}
    />

   </div>
    
  );
}
