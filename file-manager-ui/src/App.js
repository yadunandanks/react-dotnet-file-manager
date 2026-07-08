
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
  const [sortBy, setSortBy] = useState("UploadedAtUtc");
const [sortOrder, setSortOrder] = useState("desc");

const [debouncedSearch, setDebouncedSearch] = useState("");

  const[files,setFiles]=useState([]);
  const [pageNumber, setPageNumber] = useState(1);

const [pageSize] = useState(10);

const [totalPages, setTotalPages] = useState(1);
  const[loading,SetLoading]=useState(false);


  const LoadFiles = useCallback(async () => {
    SetLoading(true);

    const res = await getFiles(pageNumber, pageSize,debouncedSearch,sortBy,sortOrder);

    setFiles(res.items);
    setTotalPages(res.totalPages);

    SetLoading(false);
}, [pageNumber, pageSize,debouncedSearch,sortBy,sortOrder]);
 
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
<div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    alignItems: "center"
  }}
>
  <div>
    <label>Sort By</label>
    <br />
    <select
      value={sortBy}
      onChange={(e) => {
        setSortBy(e.target.value);
        setPageNumber(1);
      }}
      style={{
        padding: "8px",
        marginTop: "5px"
      }}
    >
      <option value="UploadedAtUtc">Uploaded Date</option>
      <option value="FileName">File Name</option>
      <option value="SizeInBytes">Size</option>
    </select>
  </div>

  <div>
    <label>Order</label>
    <br />
    <select
      value={sortOrder}
      onChange={(e) => {
        setSortOrder(e.target.value);
        setPageNumber(1);
      }}
      style={{
        padding: "8px",
        marginTop: "5px"
      }}
    >
      <option value="desc">Descending</option>
      <option value="asc">Ascending</option>
    </select>
  </div>
</div>



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
