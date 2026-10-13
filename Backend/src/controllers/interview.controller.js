const interviewReportModel = require("../models/interviewReport.model")
const generateInterviewReport = require("../services/ai.service")
const pdfParse = require("pdf-parse")

/**
 * @description Controller Generate Interview Report
 */

const genrateInterviewReportController = async (req, res) => {
  
    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        }) 

        res.status(201).json({
            message: "Interview report genrated successfully..!",
            interviewReport
        })

    } catch (err) {
        console.error("Interview report generation error:", err)
        res.status(500).json({
            message: "Failed to generate interview report",
            error: err.message
        })
        
    } 


}

/**
 * @description Controller Get Interview report By id
 */
const getInterviewReportByIdController = async (req, res) => {
    const interviewId = req.params.id;

    const interviewReport = await interviewReportModel.findOne( {_id: interviewId, user: req.user.id} )

    if(!interviewReport){
        return res.status(404).json({
            message: "Report not found"
        })
    }

    res.status(200).json({
        message: "Report Found Successfully",
        interviewReport
    })

}

/**
 * @description Controller Get all Interview Report
 */
const getAllInterviewReportController = async (req, res) => {
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDiscription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preprationPlan  ")

    res.status(200).json({
        message: "All Reports found successfully..!",
        interviewReports
    })
}


module.exports = { genrateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportController }