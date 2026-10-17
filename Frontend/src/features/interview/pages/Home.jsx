import { Check, ChevronDown, ChevronRight, ClipboardPaste, Clock3, FileText, Menu, Settings, ShieldCheck, Sparkles, Upload, X } from 'lucide-react'
import '../style/home.scss'
import { useRef, useState } from 'react'
import { useInterview } from '../hooks/useInterview'
import { Link, useNavigate } from 'react-router'

const Home = () => {

    const navigate = useNavigate()

    const { loading, genrateReport } = useInterview()

    const [jodDescription, setjodDescription] = useState('')
    const [selfDescription, setselfDescription] = useState(' ')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const resumeInputRef = useRef()

    const handleGenerateReport = async (e) => {
        e.preventDefault()
        const resumeFile = resumeInputRef.current.files[0]
        const data = await genrateReport({ selfDescription, jobDescription: jodDescription, resumeFile })

        navigate(`/interview/${data._id}`);

    }

    if (loading) {
        return (
            <main style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h1>Loading Your Interview Report... 🚀</h1>
              </main>
        );
    }

    return (
        <div className="career-agent">
            <header className="topbar">
                <Link className="brand" to="/" aria-label="CareerAgent home">
                    <span className="brand-mark"><Sparkles aria-hidden="true" /></span>
                    <span className="brand-name">CareerAgent</span>
                    <span className="brand-edition">AI STUDIO</span>
                </Link>

                <nav className={`main-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`} aria-label="Main navigation">
                    <Link className="nav-link active" to="/" onClick={() => setMobileMenuOpen(false)}>Workspace</Link>
                    <Link className="nav-link" to="/past-reports" onClick={() => setMobileMenuOpen(false)}>Past Reports</Link>
                    <a className="nav-link" href="#questions-bank" onClick={() => setMobileMenuOpen(false)}>Questions Bank</a>
                    <a className="nav-link" href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                </nav>

                <div className="account-tools">
                    <span className="credit-pill"><span className="status-dot" />8 / 10 Credits</span>
                    <button className="icon-button" type="button" aria-label="Settings"><Settings aria-hidden="true" /></button>
                    <button className="profile-button" type="button" aria-label="Account menu">KP</button>
                    <button
                        className="mobile-menu-toggle"
                        type="button"
                        aria-label="Toggle navigation menu"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                    </button>
                </div>
            </header>

            <main className="workspace" id="workspace">
                <section className="workspace-heading">
                    <div>
                        <p className="eyebrow"><span /> INPUT WORKSPACE</p>
                        <h1>Interview Prep Generator</h1>
                        <p className="intro">
                            Feed in your job description and candidate materials side-by-side to generate
                            <br className="desktop-break" /> customized interview questions, role match scoring, and STAR responses.
                        </p>
                    </div>
                    <div className="analysis-mode">
                        <span>Analysis Mode:</span>
                        <div className="mode-switch" aria-label="Analysis mode">
                            <button className="selected" type="button">Technical &amp; Behavioral</button>
                            <button type="button">Executive Summary</button>
                        </div>
                    </div>
                </section>

                <section className="interview-input-group" aria-label="Interview report inputs">
                    <article className="job-card">
                        <div className="card-heading">
                            <div className="heading-copy">
                                <span className="section-icon"><FileText aria-hidden="true" /></span>
                                <div>
                                    <h2>Job Description</h2>
                                    <p>Target role posting &amp; requirement criteria</p>
                                </div>
                            </div>
                            <div className="heading-actions">
                                <button type="button" className="subtle-button"><ClipboardPaste aria-hidden="true" /> Paste</button>
                                <button type="button" className="subtle-button">Sample JD</button>
                            </div>
                        </div>
                        <div className="job-editor">
                            <label className="visually-hidden" htmlFor="jobDescription">Enter job description</label>
                            <textarea
                                value={jodDescription}
                                onChange={(e) => setjodDescription(e.target.value)}
                                name="jobDescription"
                                id="jobDescription"
                                maxLength={12000}
                                placeholder={'Enter job description\n\nPaste requirements, key qualifications, core responsibilities, or target level (e.g. Senior Software Engineer, Staff Designer, Product Manager)...'}
                            />
                        </div>
                        <div className="field-meta">
                            <span>0 / 12,000 chars <ChevronDown className="meta-chevron" aria-hidden="true" /></span>
                            <span className="ready-state"><Check aria-hidden="true" /> Ready for parsing</span>
                            <button type="button" className="clear-button">Clear field</button>
                        </div>
                    </article>

                    <div className="candidate-inputs">
                        <article className="resume-card">
                            <div className="resume-heading">
                                <div>
                                    <h2>Resume <span className="highlight">(Use Resume and self description together for best results)</span></h2>
                                </div>
                                <span className="file-types">PDF, DOCX up to 15MB</span>
                            </div>
                            <div className="drop-zone">
                                <span className="upload-icon"><Upload aria-hidden="true" /></span>
                                <div className="drop-copy">
                                    <strong>Drag and drop your resume file</strong>
                                    <span>Automated parsing of work experience, skills &amp;<br className="desktop-break" /> impact metrics</span>
                                </div>
                                <label className="upload-button" htmlFor="resume">Upload Resume</label>
                                <input ref={resumeInputRef} hidden type="file" name="resume" id="resume" accept=".pdf,.doc,.docx" />
                            </div>
                        </article>

                        <article className="self-description-card">
                            <div className="self-heading">
                                <div>
                                    <h2>Self Description</h2>
                                    <p>Share narrative context, career pivot intentions, or standout accomplishments</p>
                                </div>
                                <span className="context-badge">Personal Context</span>
                            </div>
                            <div className="self-editor">
                                <label className="visually-hidden" htmlFor="selfDescription">Enter your self description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setselfDescription(e.target.value)}
                                    name="selfDescription"
                                    id="selfDescription"
                                    maxLength={4000}
                                    placeholder={"Enter your self description\n\nAdd personal context (e.g., specific projects you want to spotlight, leadership philosophies, career transitions, or interview areas where you'd like extra coaching)..."}
                                />
                            </div>
                            <div className="field-meta self-meta">
                                <span>0 / 4,000 chars</span>
                                <span>Helps tailor conversational STAR stories</span>
                            </div>
                        </article>

                        <button onClick={handleGenerateReport} className="generate-button" type="button">
                            <Sparkles aria-hidden="true" />
                            Generate Interview Report
                            <ChevronRight className="button-arrow" aria-hidden="true" />
                        </button>
                        <p className="privacy-note">
                            <span><ShieldCheck aria-hidden="true" /> Encrypted &amp; zero AI data training</span>
                            <span><Clock3 className="clock-icon" aria-hidden="true" /> Generation time: ~20–30s</span>
                        </p>
                    </div>
                </section>

                <section className="report-highlights" aria-label="Report highlights">
                    <article className="highlight-card">
                        <span className="highlight-number purple">1</span>
                        <div><h3>Role Match &amp; ATS Scorecard</h3><p>Pinpoint keyword gaps before recruiters screen</p></div>
                    </article>
                    <article className="highlight-card">
                        <span className="highlight-number blue">2</span>
                        <div><h3>Behavioral STAR Answers</h3><p>Role-tailored Situation, Task, Action &amp; Result</p></div>
                    </article>
                    <article className="highlight-card">
                        <span className="highlight-number green">3</span>
                        <div><h3>Reverse Questions for Panel</h3><p>Intelligent questions that showcase domain expertise</p></div>
                    </article>
                </section>
            </main>
        </div>
    )
}

export default Home
