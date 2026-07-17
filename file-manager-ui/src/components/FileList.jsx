import { downloadFile, deletedFile, renameFile,updateMetadata } from "../api/filesApi";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Typography
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, onChanged }) {
const[renameOpen,setRenameOpen]= useState(false);
const[selectedFile,setSelectedFile]=useState(null);
const[newFileName,setNewFileName]=useState("");
const[description,setDescription]=useState("");
const[category,setCategory]=useState("");
const[tags,setTags]=useState("");
const[metadataopen,setMetadataOpen]=useState(false);


const handleRenameClick=(file)=> {
setSelectedFile(file.id)
setNewFileName(file.fileName);
setRenameOpen(true);
}

const handleRename=async()=> {

  try {
    await renameFile(selectedFile,newFileName);
    setRenameOpen(false);
    onChanged();

  }
  catch {
    alert("rename failed");
  }
}

const handleMetadataClick= async(file)=> {

  setSelectedFile(file);
  setDescription(file.description || "");
    setTags(file.tags || "");
    setCategory(file.category || "");

    setMetadataOpen(true);


   

}
    

const handleMetadataSave =async()=> {

try {

  await  updateMetadata(selectedFile.id, {
    description,
    tags,
    category
  });
   setMetadataOpen(false);

        onChanged();

} catch {
alert("Metadata update failed.");
  
  
}

}


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?"))
      return;

    try {
      await deletedFile(id);
      onChanged();
    }
    catch (err) {
      alert("Failed to delete file.");
    }
  };

  if (files.length === 0) {
    return (
      <Typography
        variant="h6"
        align="center"
        sx={{ mt: 5 }}
      >
        No files uploaded yet.
      </Typography>
    );
  }
  // console.log(files);

  return (
    <>
   
    <TableContainer
      component={Paper}
      elevation={4}
      sx={{
        mt: 3,
        borderRadius: 2
      }}
    >
      <Table>

        <TableHead>
          <TableRow
            sx={{
              "& th": {
                backgroundColor: "#1976d2",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px"
              }
            }}
          >
            <TableCell>Name</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Uploaded</TableCell>
            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          {files.map((file) => (

            <TableRow
              key={file.id}
              hover
            >

              <TableCell>
               {file.fileName}
              </TableCell>

              <TableCell>
                {formatSize(file.sizeInBytes)}
              </TableCell>

              <TableCell>
                {new Date(file.uploadedAtUtc).toLocaleString()}
              </TableCell>

              <TableCell align="center">

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                >

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                     downloadFile(file.id, file.fileName)
                    }
                  >
                    Download
                  </Button>
                  <Button
    variant="contained"
    color="warning"
    size="small"
    onClick={() => handleRenameClick(file)}
>
    Rename
</Button>
  <button onClick={() => handleMetadataClick(file)}>
    Edit Metadata
</button>



                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      handleDelete(file.id)
                    }
                  >
                    Delete
                  </Button>

                </Stack>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>
    </TableContainer>

    {renameOpen && (
    <div className="modal">

        <h3>Rename File</h3>

        <input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
        />

        <button onClick={handleRename}>
            Save
        </button>

        <button onClick={() => setRenameOpen(false)}>
            Cancel
        </button>
      

    </div>
)}

{metadataopen && (
    <div
        style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            minWidth: "350px"
        }}
    >
        <h3>Edit Metadata</h3>

        <div style={{ marginBottom: "10px" }}>
            <label>Description</label>
            <br />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%" }}
            />
        </div>

        <div style={{ marginBottom: "10px" }}>
            <label>Tags</label>
            <br />
            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ width: "100%" }}
            />
        </div>

        <div style={{ marginBottom: "15px" }}>
            <label>Category</label>
            <br />
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%" }}
            />
        </div>

        <button onClick={handleMetadataSave}>
            Save
        </button>

        <button
            onClick={() => setMetadataOpen(false)}
            style={{ marginLeft: "10px" }}
        >
            Cancel
        </button>
    </div>
)}
     </>
  );
}