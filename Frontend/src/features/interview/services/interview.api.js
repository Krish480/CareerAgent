import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

/**
 * @description Generate Interview Report
 */

export const generateInterviewReport = async ({ selfDescription, jobDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)
    
    const response =  await api.post("api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"         
        }   
    })
    console.log(response)
    return response.data
}

/**
 * @description Get Interview Report By Id
 */
export const generateReportById = async (interviewId)  => {
    const response = await api.get(`/api/interview/report/${interviewId}` )

    return response.data
}

/**
 * @description Get all interview reports
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/reports")

    return response.data
}