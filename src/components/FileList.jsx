import { downloadFile, deletedFile } from "../api/filesApi";

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

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, onChanged }) {

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
               <TableCell>{file.fileName}</TableCell>
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
  );
}