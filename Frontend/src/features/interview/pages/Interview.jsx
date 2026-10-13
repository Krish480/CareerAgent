import { useState } from 'react'
import { BookOpenCheck, Check, CircleHelp, Lightbulb, Target } from 'lucide-react'
import { useLocation } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'

const sections = [
    { id: 'technical', label: 'Technical questions', icon: Target },
    { id: 'behavioral', label: 'Behavioral questions', icon: CircleHelp },
    { id: 'roadmap', label: 'Road Map', icon: BookOpenCheck },
]


const Interview = () => {
    const location = useLocation()
    const { report: contextReport, loading } = useInterview()
    
    const report = contextReport || location.state?.interviewData || location.state?.interview || location.state || null;

    const [activeSection, setActiveSection] = useState('technical')
    
    if(loading){
        return (
            <main><h1>Loading Interview Plan</h1></main>
        )
    }

    if (!report) {
        return (
            <main style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h2>No interview report found. Please generate one from the Home page.</h2>
            </main>
        )
    }

    const questions = activeSection === 'technical'
        ? report.technicalQuestions ?? []
        : report.behavioralQuestions ?? []
    const skillGaps = report.skillGaps ?? []
    const preparationPlan = report.preparationPlan ?? []


    return (
        <main className="interview-page">
            <div className="interview-layout">
                <aside className="interview-sidebar interview-sidebar-left" aria-label="Interview report sections">
                    <p className="interview-sidebar-label">YOUR PREPARATION</p>
                    <nav className="interview-section-nav">
                        {sections.map(({ id, label, icon: Icon }) => (
                            <button
                                className={`interview-nav-link${activeSection === id ? ' active' : ''}`}
                                key={id}
                                onClick={() => setActiveSection(id)}
                                type="button"
                                aria-current={activeSection === id ? 'page' : undefined}
                            >
                                <Icon aria-hidden="true" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <section className="interview-content" aria-live="polite">
                    <header className="interview-content-header">
                        <div>
                            <p className="interview-eyebrow">INTERVIEW PREPARATION</p>
                            <h1>
                                {activeSection === 'technical' && 'Technical questions'}
                                {activeSection === 'behavioral' && 'Behavioral questions'}
                                {activeSection === 'roadmap' && 'Your preparation roadmap'}
                            </h1>
                        </div>
                        {report.matchScore != null && (
                            <div className="match-score" aria-label={`Match score ${report.matchScore} percent`}>
                                <span className="match-score-value">{report.matchScore}%</span>
                                <span className="match-score-label">Match score</span>
                            </div>
                        )}
                    </header>

                    {activeSection === 'roadmap' ? (
                        preparationPlan.length > 0 ? (
                            <div className="roadmap-list">
                                {preparationPlan.map((dayPlan, index) => (
                                    <article className="roadmap-card" key={dayPlan._id ?? dayPlan.day ?? index}>
                                        <span className="roadmap-day">DAY {dayPlan.day ?? index + 1}</span>
                                        <div className="roadmap-card-content">
                                            <h2>{dayPlan.focus}</h2>
                                            <ul>
                                                {(dayPlan.tasks ?? []).map((task, taskIndex) => (
                                                    <li key={`${dayPlan.day ?? index}-${taskIndex}`}>
                                                        <Check aria-hidden="true" />
                                                        <span>{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="interview-empty-state">No preparation roadmap is available yet.</p>
                        )
                    ) : questions.length > 0 ? (
                        <div className="question-list">
                            {questions.map((item, index) => (
                                <article className="question-card" key={item._id ?? `${activeSection}-${index}`}>
                                    <div className="question-card-heading">
                                        <span className="question-number">QUESTION {String(index + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h2>{item.question}</h2>
                                    {item.intention && (
                                        <div className="question-detail">
                                            <Lightbulb aria-hidden="true" />
                                            <p><strong>What this assesses</strong>{item.intention}</p>
                                        </div>
                                    )}
                                    {item.answer && (
                                        <div className="answer-detail">
                                            <span>Suggested answer</span>
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="interview-empty-state">
                            No {activeSection} questions are available yet.
                        </p>
                    )}
                </section>

                <aside className="skill-gaps-panel interview-sidebar-right" aria-labelledby="skill-gaps-title">
                    <div className="skill-gaps-heading">
                        <span className="skill-gaps-icon"><Lightbulb aria-hidden="true" /></span>
                        <div>
                            <p className="interview-eyebrow">FOCUS AREAS</p>
                            <h2 id="skill-gaps-title">Skill Gaps</h2>
                        </div>
                    </div>
                    {skillGaps.length > 0 ? (
                        <ul className="skill-gap-list">
                            {skillGaps.map((gap, index) => (
                                <li className={`skill-gap severity-${(gap.severity ?? 'medium').toLowerCase()}`} key={`${gap.skill}-${index}`}>
                                    <span className="skill-gap-dot" aria-hidden="true" />
                                    <span>{gap.skill}</span>
                                    <span className="skill-gap-severity">{gap.severity ?? 'medium'}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="skill-gaps-empty">No skill gaps to show yet.</p>
                    )}
                </aside>
            </div>
        </main>
    )
}

export default Interview
