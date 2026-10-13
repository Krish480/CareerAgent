const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description, job description and resume pdf
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.genrateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report By interviewId
 *@access Private
 */
interviewRouter.get("/report/:id", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @router GET /api/interview
 * @description Get all interview reports
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportController)

module.exports = interviewRouter;  