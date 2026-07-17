
import './App.css';
import Typography from "@mui/material/Typography";
import { Pagination } from "@mui/material";
import { useFiles } from './components/useFiles';
import { useEffect, useState ,useRef,useMemo} from "react";
import { ThemeContext } from './context/ThemeContext';
import { useContext } from 'react';


import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";

export default function App() {
  // const[rename,SetRename]= useState("");
  const[search,setSearch]= useState("");
  const [sortBy, setSortBy] = useState("UploadedAtUtc");
  const [pageNumber, setPageNumber] = useState(1);
const [sortOrder, setSortOrder] = useState("desc");
const [pageSize] = useState(10);
const theme = useContext(ThemeContext);


const [debouncedSearch, setDebouncedSearch] = useState("");
const { files, loading, refresh,totalPages, } = useFiles(pageNumber, pageSize,debouncedSearch,
    sortBy,
    sortOrder);



  const searchInputRef = useRef(null);

  const totalStorage = useMemo(() => {
    console.log("Calculating total storage...");

    return files.reduce((sum, file) => {
        return sum + file.sizeInBytes;
    }, 0);

}, [files]);

const formattedStorage = useMemo(() => {

    if (totalStorage < 1024)
        return `${totalStorage} Bytes`;

    if (totalStorage < 1024 * 1024)
        return `${(totalStorage / 1024).toFixed(2)} KB`;

    return `${(totalStorage / (1024 * 1024)).toFixed(2)} MB`;

}, [totalStorage]);


  

useEffect(()=> {
  searchInputRef.current.focus();
},[])

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
<Typography variant="h6">
    Current Theme: {theme}
</Typography>

<input
    type="text"
    placeholder="Search files..."
    value={search}
    ref={searchInputRef}
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
<button onClick={()=> {
 setSearch("");
 setDebouncedSearch("");
        setPageNumber(1);
searchInputRef.current.focus();
}}
 >Clear</button>
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



       <FileUpload onUploaded={refresh} />

<FileList
    files={files}
    onChanged={refresh}
/>
<div
  style={{
    margin: "20px 0",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa"
  }}
>
  <h3>File Statistics</h3>

  <p>
    <strong>Total Files:</strong> {files.length}
  </p>

  <p>
    <strong>Total Storage:</strong> {formattedStorage}
  </p>
</div>

        {/* {loading ? <p>Loading...</p> : <FileList files={files}  />} */}
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
