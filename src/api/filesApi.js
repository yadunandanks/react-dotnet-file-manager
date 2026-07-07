import axios from "axios";

const API_BASE = "http://localhost:5007/api/files"; // match your backend port


// export const getFiles= axios.get(API_BASE);
export const getFiles = async (pageNumber = 1, pageSize = 10,search="") => {
    const response= await axios.get(API_BASE, {

params: {
    pageNumber,
    pageSize,
    search
}

    });
    return response.data;

};

export const uploadFiles= (file,onProgress)=>  {
    const formData= new FormData();
    formData.append("file",file);
     return axios.post(`${API_BASE}/upload`, formData, 
        {
    headers: { "Content-Type": "multipart/form-data" },

    onUploadProgress: (event)=> {
        const percent = Math.round(
                (event.loaded * 100) / event.total
            );

            onProgress(percent);
    }
    
  });
}

export const downloadFile = (id) => {
    window.location.href = `${API_BASE}/${id}/download`;
};

export const deletedFile= (id)=> axios.delete(`${API_BASE}/${id}`);