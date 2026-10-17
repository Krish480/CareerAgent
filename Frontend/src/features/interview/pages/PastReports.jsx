import React, { useState, useMemo } from 'react'
import {
    Sparkles,
    Settings,
    Search,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Briefcase,
    Clock,
    LayoutGrid,
    List,
    X,
    Menu,
    RotateCcw,
    FileText,
    Award
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import '../style/pastReports.scss'
import { useInterview } from '../hooks/useInterview'

const PastReports = () => {
    const navigate = useNavigate()
    
    // 💡 FIX 1: Hook ko component ke andar move kiya gaya
    const { reports, loading } = useInterview() 

    const [searchQuery, setSearchQuery] = useState('')
    const [scoreFilter, setScoreFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')
    const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Backend se aane wale null/undefined data se bachne ke liye default empty array
    const actualReports = reports || []

    // Filter & Sort real reports
    const filteredReports = useMemo(() => {
        return actualReports.filter((report) => {
            // Defensive mapping: Backend ke variables alag ho sakte hain, isliye fallback use kiya hai
            const jobTitle = (report.jobTitle || report.title || 'Interview Report').toLowerCase()
            const company = (report.company || 'Unknown Company').toLowerCase()
            const category = (report.category || 'General').toLowerCase()
            const score = report.matchScore || 0

            const matchesQuery =
                jobTitle.includes(searchQuery.toLowerCase()) ||
                company.includes(searchQuery.toLowerCase()) ||
                category.includes(searchQuery.toLowerCase())

            if (!matchesQuery) return false

            if (scoreFilter === 'high') return score >= 85
            if (scoreFilter === 'medium') return score >= 75 && score < 85
            if (scoreFilter === 'low') return score < 75

            return true
        }).sort((a, b) => {
            const scoreA = a.matchScore || 0
            const scoreB = b.matchScore || 0
            
            if (sortBy === 'highest-score') return scoreB - scoreA
            if (sortBy === 'lowest-score') return scoreA - scoreB
            if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
            
            // default 'newest'
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        })
    }, [searchQuery, scoreFilter, sortBy, actualReports])

    // Metric Calculations - Safely handling division by zero if no reports exist
    const totalReports = actualReports.length
    const avgScore = totalReports > 0
        ? Math.round(actualReports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalReports)
        : 0
    const topScore = totalReports > 0 ? Math.max(...actualReports.map((r) => r.matchScore || 0)) : 0
    
    // Real data arrays ki length calculate kar rahe hain
    const totalQuestions = actualReports.reduce(
        (acc, curr) => acc + (curr.technicalQuestions?.length || 0) + (curr.behavioralQuestions?.length || 0),
        0
    )

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    const getScoreBadgeClass = (score) => {
        if (score >= 85) return 'high'
        if (score >= 75) return 'medium'
        return 'low'
    }

    const handleViewReport = (reportId) => {
        navigate(`/interview/${reportId}`)
    }

    const handleResetFilters = () => {
        setSearchQuery('')
        setScoreFilter('all')
        setSortBy('newest')
    }

    // 💡 FIX 2: Jab tak API se data aa raha hai, Loading screen dikhao
    if (loading) {
        return (
            <div className="past-reports-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>Loading your past reports...</h2>
            </div>
        )
    }

    return (
        <div className="past-reports-page">
            {/* Top Navigation Bar */}
            <header className="topbar">
                <Link className="brand" to="/" aria-label="CareerAgent home">
                    <span className="brand-mark">
                        <Sparkles aria-hidden="true" />
                    </span>
                    <span className="brand-name">CareerAgent</span>
                    <span className="brand-edition">AI STUDIO</span>
                </Link>

                <nav
                    className={`main-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}
                    aria-label="Main navigation"
                >
                    <Link className="nav-link" to="/" onClick={() => setMobileMenuOpen(false)}>
                        Workspace
                    </Link>
                    <Link
                        className="nav-link active"
                        to="/past-reports"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Past Reports
                    </Link>
                    <a
                        className="nav-link"
                        href="#questions-bank"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Questions Bank
                    </a>
                    <a
                        className="nav-link"
                        href="#pricing"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Pricing
                    </a>
                </nav>

                <div className="account-tools">
                    <span className="credit-pill">
                        <span className="status-dot" />
                        8 / 10 Credits
                    </span>
                    <button className="icon-button" type="button" aria-label="Settings">
                        <Settings aria-hidden="true" />
                    </button>
                    <button className="profile-button" type="button" aria-label="Account menu">
                        KP
                    </button>
                    <button
                        className="mobile-menu-toggle"
                        type="button"
                        aria-label="Toggle navigation menu"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                    >
                        {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="reports-container">
                {/* Header */}
                <section className="reports-header">
                    <div className="header-left">
                        <p className="eyebrow">
                            <span className="status-dot-purple" /> SAVED ASSESSMENTS &amp; ANALYTICS
                        </p>
                        <h1>Past Interview Reports</h1>
                        <p className="intro">
                            Access your previously analyzed job descriptions, role compatibility ratings,
                            and generated STAR response strategies.
                        </p>
                    </div>
                </section>

                {/* Quick Metric Stats Bar */}
                <section className="reports-stats-bar" aria-label="Quick statistics">
                    <div className="stat-chip">
                        <div className="stat-icon">
                            <Briefcase aria-hidden="true" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Total Reports</span>
                            <span className="stat-value">{totalReports}</span>
                        </div>
                    </div>

                    <div className="stat-chip">
                        <div className="stat-icon green">
                            <TrendingUp aria-hidden="true" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Avg Match Score</span>
                            <span className="stat-value">{avgScore}%</span>
                        </div>
                    </div>

                    <div className="stat-chip">
                        <div className="stat-icon blue">
                            <Award aria-hidden="true" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Highest Score</span>
                            <span className="stat-value">{topScore}%</span>
                        </div>
                    </div>

                    <div className="stat-chip">
                        <div className="stat-icon">
                            <FileText aria-hidden="true" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Questions Prepared</span>
                            <span className="stat-value">{totalQuestions}</span>
                        </div>
                    </div>
                </section>

                {/* Search & Filter Toolbar */}
                <section className="reports-toolbar" aria-label="Filter and search reports">
                    <div className="search-box">
                        <Search className="search-icon" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search by job title, company, or domain..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search past reports"
                        />
                        {searchQuery && (
                            <button
                                className="clear-search"
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search query"
                            >
                                <X aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    <div className="filter-controls">
                        <select
                            className="filter-select"
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            aria-label="Filter by Match Score"
                        >
                            <option value="all">All Match Scores</option>
                            <option value="high">High Match (85%+)</option>
                            <option value="medium">Moderate Match (75–84%)</option>
                            <option value="low">Needs Review (&lt;75%)</option>
                        </select>

                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort reports"
                        >
                            <option value="newest">Sort: Newest First</option>
                            <option value="highest-score">Sort: Highest Match</option>
                            <option value="lowest-score">Sort: Lowest Match</option>
                            <option value="oldest">Sort: Oldest First</option>
                        </select>

                        <div className="view-mode-toggle" aria-label="Layout view mode">
                            <button
                                type="button"
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                                title="Grid View"
                            >
                                <LayoutGrid aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                                title="List View"
                            >
                                <List aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Reports Content (Grid or List) */}
                {filteredReports.length > 0 ? (
                    <section
                        className={viewMode === 'grid' ? 'reports-grid' : 'reports-list'}
                        aria-label="Past reports list"
                    >
                        {filteredReports.map((report) => (
                            <article className="report-card" key={report._id}>
                                <div className="card-top">
                                    <div className="company-meta">
                                        <span className="company-badge">{report.company || 'Unknown'}</span>
                                        <span className="role-tag">{report.category || 'General'}</span>
                                    </div>
                                    <span
                                        className={`match-score-badge ${getScoreBadgeClass(
                                            report.matchScore || 0
                                        )}`}
                                    >
                                        <TrendingUp size={11} aria-hidden="true" />
                                        {report.matchScore || 0}% Match
                                    </span>
                                </div>

                                <div className="card-body">
                                    <h2 className="job-title">{report.jobTitle || report.title || 'Interview Report'}</h2>
                                    <p className="date-generated">
                                        <Calendar aria-hidden="true" />
                                        Generated on {formatDate(report.createdAt)}
                                    </p>

                                    <div className="card-stats-pills">
                                        <span className="pill">
                                            <CheckCircle2 aria-hidden="true" />
                                            {report.technicalQuestions?.length || 0} Tech Qs
                                        </span>
                                        <span className="pill">
                                            <Clock aria-hidden="true" />
                                            {report.behavioralQuestions?.length || 0} STAR Answers
                                        </span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <span className="report-mode-tag">{report.mode || 'Technical & Behavioral'}</span>
                                    <button
                                        type="button"
                                        className="view-report-button"
                                        onClick={() => handleViewReport(report._id)}
                                    >
                                        View Report
                                        <ArrowUpRight aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="empty-reports-state">
                        <div className="empty-icon-wrap">
                            <Search aria-hidden="true" />
                        </div>
                        <h3>No Interview Reports Found</h3>
                        <p>
                            No reports matched your current search filters or you haven't generated any reports yet.
                        </p>
                        <button
                            type="button"
                            className="reset-filter-btn"
                            onClick={handleResetFilters}
                        >
                            <RotateCcw aria-hidden="true" /> Reset Filters
                        </button>
                    </section>
                )}
            </main>
        </div>
    )
}

export default PastReports