import { useEffect, useState , useCallback} from "react";
import { getFiles } from "../api/filesApi";   // <-- check your path

export function useFiles(pageNumber, pageSize,search,
    sortBy,
    sortOrder) {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    

   const loadFiles = useCallback(async () => {
    try {
        setLoading(true);

       const data = await getFiles(
    pageNumber,
    pageSize,
    search,
    sortBy,
    sortOrder
);

        setFiles(data.items);
        setTotalPages(data.totalPages);
    } finally {
        setLoading(false);
    }
}, [pageNumber, pageSize, search,
    sortBy,
    sortOrder]);

   useEffect(() => {
    loadFiles();
}, [loadFiles]);

    return {
        files,
        loading,
        totalPages,
        refresh: loadFiles,


    };
}