const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "The match score between the candidate and the job description"
        },
        technicalQuestions: {
            type: "array",
            description: "Technical questions that can be asked in the interview along with their intention",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The exact technical question to ask the candidate." },
                    intention: { type: "string", description: "The intention of interviewer to ask this question" },
                    answer: { type: "string", description: "An ideal sample response from the candidate's perspective. Include exact technical points they should mention (e.g., 'I would use Redux for state management because...')" }
                }
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "Behavioral questions that can be asked in the interview along with their intention",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The exact behavioral question to ask the candidate." },
                    intention: { type: "string", description: "The intention of interviewer to ask this question" },
                    answer: { type: "string", description: "An ideal sample response using the STAR method from the candidate's perspective. (e.g., 'In my last project, I faced this issue and I solved it by...')" }
                }
            }
        },
        skillGaps: {
            type: "array",
            description: "Skills that the candidate is lacking along with their severity",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The specific skill or technology that the candidate is lacking." },
                    severity: { type: "string", enum: ["low", "medium", "high"], description: "The severity of the skill gap" }
                }
            }
        },
        preparationPlan: {
            type: "array",
            description: "Preparation plan for the candidate to improve their skills and prepare for the interview",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "The day number (e.g., 1, 2, 3)" },
                    focus: { type: "string", description: "The main topic to focus on for that day" },
                    tasks: {
                        type: "array",
                        description: "Specific actionable tasks to complete on that day",
                        items: { type: "string" }
                    }
                }
            }
        }, 
        title: {
            type: "string",
            description: "The title of job which the interview report is generated"
        }
    }
};

const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    const prompt = `You are an expert technical interviewer and career coach. Based on the following details, generate a comprehensive interview report strictly in the provided JSON schema. 
    CRITICAL INSTRUCTIONS FOR ANSWERS:  
    1. Keep the 'answer' field for both technical and behavioral questions VERY SHORT and conversational.
    2. In real interviews, candidates speak in brief, to-the-point sentences. Do NOT write long paragraphs.   
    3. Limit every answer to 2-3 short sentences (maximum 30-40 words) or 2-3 quick bullet points. 
    4. Write the answer from the candidate's perspective (e.g., "I used Redux      because...").

    Candidate Details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
            temperature: 0.2,
        }
    });

    const parsedData = JSON.parse(response.text);
    // console.log(JSON.stringify(parsedData, null, 2));
    return parsedData;
};

module.exports = generateInterviewReport;