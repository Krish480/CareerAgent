import { useContext, useEffect } from "react";
import { generateInterviewReport, generateReportById, getAllInterviewReports } from "../services/interview.api"
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";


export const useInterview = () => {
    const context = useContext(InterviewContext)

    const { interviewId } = useParams()

    const { report, reports, loading, setReport, setReports, setLoading } = context;

    const genrateReport = async ({ selfDescription, jobDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })

            setReport(response.interviewReport)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {

            response = await generateReportById(interviewId)
            setReport(response?.interviewReport || null)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response?.interviewReports || [])
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, genrateReport, getReportById, getReports }

} 