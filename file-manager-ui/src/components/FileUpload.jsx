
import { useState } from "react";
import { uploadFiles } from "../api/filesApi";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";





export default function FileUpload({onUploaded}) {
const[selectedFile,SetSelectedFile]= useState(null);
const[uploading,SetUploding]= useState(false);
  const [error, setError] = useState("");
  const[progress,SetProgress]=useState(0);
  const [isUploading, setIsUploading] = useState(false);



  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,

    onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            SetSelectedFile(acceptedFiles[0]);
        }
    }
});


  const handleUpload= async() => {


    if (!selectedFile)
    return;

    SetUploding(true);
setIsUploading(true);
SetProgress(0)

    setError("");
    try {
     await uploadFiles(selectedFile, (percent) => {

            SetProgress(percent);

        });
     SetSelectedFile(null);
      onUploaded();



    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
     
       SetUploding(false);

    setIsUploading(false);
    }

    
}
// console.log(selectedFile);
// console.log(files);

return (
    <div style={{ marginBottom: "1.5rem" }}>

        <div
            {...getRootProps()}
            style={{
                border: "2px dashed #1976d2",
                padding: "40px",
                borderRadius: "10px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive
                    ? "#e3f2fd"
                    : "#fafafa",
                marginBottom: "20px"
            }}
        >
            <input {...getInputProps()} />

            <p>
                {isDragActive
                    ? "📂 Drop the file here..."
                    : "📁 Drag & Drop a file here or click to browse"}
            </p>

           {selectedFile && (
    <div
        style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f5f5f5",
            borderRadius: "8px",
            display: "inline-block",
            maxWidth: "90%"
        }}
    >
        <div style={{ fontWeight: "bold" }}>
            📄 {selectedFile.name}
        </div>

        <div
            style={{
                color: "#666",
                marginTop: "5px"
            }}
        >
            {(selectedFile.size / 1024).toFixed(1)} KB
        </div>
    </div>
)}
        </div>

        <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
        >
            {uploading ? "Uploading..." : "Upload"}
        </Button>
        {isUploading && (

    <div style={{ marginTop: "20px" }}>

        <progress
            value={progress}
            max="100"
            style={{ width: "100%" }}
        />

        <p>{progress}%</p>

    </div>

)}

        {error && (
            <p style={{ color: "red" }}>
                {error}
            </p>
        )}

        

    </div>
);

}