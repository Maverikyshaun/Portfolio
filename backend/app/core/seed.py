from datetime import date

from app.core.database import SessionLocal, init_db
from app.enums import (
    AvailabilityStatus,
    EducationLevel,
    EmploymentType,
    MediaKind,
    ProficiencyLevel,
    ProjectKind,
    Sector,
    SkillCategory,
)
from app.models import (
    Education,
    EducationHighlight,
    Experience,
    ExperienceHighlight,
    MediaAsset,
    Profile,
    Project,
    ProjectHighlight,
    Skill,
)


PROFILE = {
    "full_name": "Shantanu Soni",
    "first_name": "Shantanu",
    "headline": "Data Scientist and emerging AI Engineer",
    "location": "Epsom, Surrey, United Kingdom",
    "email": "shantanusoniuv@gmail.com",
    "phone": "07824 700478",
    "summary": (
        "Data Scientist and emerging AI Engineer with 5+ years of experience across aviation and energy, "
        "delivering production-grade data products, machine learning models, APIs, and impactful visualizations. "
        "Adept at leveraging SQL, Python, Power BI, LLMs, RAG, LangChain, and agentic AI workflows to optimize "
        "data infrastructure, enhance analytics, and streamline decision-making."
    ),
    "years_experience": 5,
    "availability": AvailabilityStatus.OPEN_TO_CONVERSATION,
    "photo_url": "/static/assets/headshot.jpg",
    "cv_url": "/static/assets/Shantanu_Soni_CV.pdf",
    "linkedin_url": None,
    "github_url": None,
    "website_url": None,
}

EXPERIENCES = [
    {
        "company": "IBA Group",
        "title": "Senior Data Scientist",
        "location": "Aviation sector",
        "sector": Sector.AVIATION,
        "employment_type": EmploymentType.FULL_TIME,
        "start_date": date(2026, 1, 1),
        "end_date": None,
        "is_current": True,
        "sort_order": 1,
        "highlights": [
            "Spearheaded forecasting models using best-fit machine learning programs.",
            "Managing database integrity of various in-house Python models.",
            "Applying LLM and agentic AI workflows to support research, documentation, quality checks, and productivity.",
        ],
    },
    {
        "company": "IBA Group",
        "title": "Data Scientist",
        "location": "Aviation sector",
        "sector": Sector.AVIATION,
        "employment_type": EmploymentType.FULL_TIME,
        "start_date": date(2022, 9, 1),
        "end_date": date(2026, 1, 1),
        "is_current": False,
        "sort_order": 2,
        "highlights": [
            "Designed and implemented scalable data engineering infrastructure, optimising storage, retrieval, and performance.",
            "Developed production-grade Python APIs for data manipulation, modelling, and deployment-ready analytics.",
            "Delivered a quarterly update tool enabling consultants to update databases and generate aircraft value opinions.",
            "Built continuous testing of BigQuery datasets and tables, ensuring integrity and accessibility for stakeholders.",
            "Led data preparation and statistical modelling for machine learning projects and advanced analytics use cases.",
            "Migrated complex Excel-based models to Python, improving scalability and performance on large datasets.",
            "Deployed Power BI dashboards connected to AWS data sources, improving reporting efficiency.",
            "Established end-to-end ETL pipelines and data warehousing solutions, reducing data delivery timelines.",
            "Translated complex analytical findings into clear, actionable insights for senior leadership and clients.",
            "Designed and maintained technical dashboards in Power BI for real-time status tracking.",
            "Incorporated agentic AI techniques to enhance workplace productivity and repeatable analysis workflows.",
            "Developed a complex financial aircraft leasing model for lessors to assess exposure when leasing.",
        ],
    },
    {
        "company": "IOCL",
        "title": "Data Analyst",
        "location": "Energy sector",
        "sector": Sector.ENERGY,
        "employment_type": EmploymentType.FULL_TIME,
        "start_date": date(2020, 10, 1),
        "end_date": date(2021, 6, 1),
        "is_current": False,
        "sort_order": 3,
        "highlights": [
            "Created a centralized repository across ERP systems, CRM systems and spreadsheets, increasing downstream productivity.",
            "Developed a forecasting model using TensorFlow, reducing asset replacement downtime.",
            "Built refinery Power BI dashboards, recognized by management and earning Employee of the Month twice consecutively.",
            "Designed a memory-optimized database, reducing storage costs by 30%.",
            "Operated in an Agile environment with sprint planning, daily stand-ups, and cross-functional collaboration.",
        ],
    },
    {
        "company": "IOCL",
        "title": "Graduate Apprentice Engineer",
        "location": "Energy sector",
        "sector": Sector.ENERGY,
        "employment_type": EmploymentType.APPRENTICESHIP,
        "start_date": date(2019, 11, 1),
        "end_date": date(2020, 10, 1),
        "is_current": False,
        "sort_order": 4,
        "highlights": [
            "Automated workflows using VBA and Macros, enhancing operational efficiency.",
            "Built Excel loaders and Python scripts to keep databases current with the latest data.",
            "Developed an Excel-based financial modelling tool for clients, later offered on a subscription basis.",
            "Collaborated with product design teams to develop data-driven insights that enhanced user experience.",
        ],
    },
]

EDUCATION = [
    {
        "institution": "University of Exeter",
        "credential": "Master of Science",
        "field_of_study": "Business Analytics",
        "location": "Exeter, United Kingdom",
        "level": EducationLevel.MASTERS,
        "end_date": date(2022, 5, 1),
        "classification": "Distinction",
        "score_label": None,
        "sort_order": 1,
        "highlights": [
            "Dissertation: Using song sentiment from Spotify to draw financial insights.",
            "Retrieved Spotify API sentiment data and performed preprocessing, aggregation, and filtering.",
            "Applied ARIMA and RNNs to forecast financial trends using Spotify metrics.",
        ],
    },
    {
        "institution": "Indian Institute of Technology, BHU",
        "credential": "Bachelor of Technology",
        "field_of_study": "Engineering",
        "location": "Varanasi, India",
        "level": EducationLevel.BACHELORS,
        "end_date": date(2017, 5, 1),
        "classification": None,
        "score_label": "GPA 8.55",
        "sort_order": 2,
        "highlights": [],
    },
    {
        "institution": "Delhi Public School",
        "credential": "A Level equivalent",
        "field_of_study": "Secondary education",
        "location": "Varanasi, India",
        "level": EducationLevel.A_LEVEL,
        "end_date": date(2012, 5, 1),
        "classification": None,
        "score_label": "93.60%",
        "sort_order": 3,
        "highlights": [],
    },
    {
        "institution": "Delhi Public School",
        "credential": "GCSE equivalent",
        "field_of_study": "Secondary education",
        "location": "Varanasi, India",
        "level": EducationLevel.GCSE,
        "end_date": date(2010, 5, 1),
        "classification": None,
        "score_label": "93.1%",
        "sort_order": 4,
        "highlights": [],
    },
]

SKILLS = [
    ("Python", SkillCategory.PROGRAMMING, ProficiencyLevel.EXPERT, True, 1),
    ("SQL", SkillCategory.PROGRAMMING, ProficiencyLevel.EXPERT, True, 2),
    ("R", SkillCategory.PROGRAMMING, ProficiencyLevel.ADVANCED, False, 3),
    ("JavaScript", SkillCategory.PROGRAMMING, ProficiencyLevel.PROFICIENT, False, 4),
    ("Java", SkillCategory.PROGRAMMING, ProficiencyLevel.FOUNDATIONAL, False, 5),
    ("C", SkillCategory.PROGRAMMING, ProficiencyLevel.FOUNDATIONAL, False, 6),
    ("VBA", SkillCategory.PROGRAMMING, ProficiencyLevel.ADVANCED, False, 7),
    ("PostgreSQL", SkillCategory.DATABASE, ProficiencyLevel.ADVANCED, True, 10),
    ("BigQuery", SkillCategory.DATABASE, ProficiencyLevel.ADVANCED, True, 11),
    ("MongoDB", SkillCategory.DATABASE, ProficiencyLevel.PROFICIENT, False, 12),
    ("Redis", SkillCategory.DATABASE, ProficiencyLevel.PROFICIENT, False, 13),
    ("Cassandra", SkillCategory.DATABASE, ProficiencyLevel.FOUNDATIONAL, False, 14),
    ("Scikit-Learn", SkillCategory.MACHINE_LEARNING, ProficiencyLevel.ADVANCED, True, 20),
    ("PyTorch", SkillCategory.MACHINE_LEARNING, ProficiencyLevel.ADVANCED, True, 21),
    ("TensorFlow", SkillCategory.MACHINE_LEARNING, ProficiencyLevel.ADVANCED, True, 22),
    ("Forecasting", SkillCategory.MACHINE_LEARNING, ProficiencyLevel.ADVANCED, False, 23),
    ("CNNs / RNNs", SkillCategory.MACHINE_LEARNING, ProficiencyLevel.ADVANCED, False, 24),
    ("ARIMA", SkillCategory.MACHINE_LEARNING, ProficiencyLevel.ADVANCED, False, 25),
    ("Microsoft Azure", SkillCategory.CLOUD, ProficiencyLevel.PROFICIENT, False, 30),
    ("AWS analytics", SkillCategory.CLOUD, ProficiencyLevel.ADVANCED, True, 31),
    ("FastAPI", SkillCategory.CLOUD, ProficiencyLevel.ADVANCED, True, 32),
    ("Flask", SkillCategory.CLOUD, ProficiencyLevel.PROFICIENT, False, 33),
    ("LLMs", SkillCategory.AI_ENGINEERING, ProficiencyLevel.ADVANCED, True, 40),
    ("RAG", SkillCategory.AI_ENGINEERING, ProficiencyLevel.ADVANCED, True, 41),
    ("LangChain", SkillCategory.AI_ENGINEERING, ProficiencyLevel.ADVANCED, True, 42),
    ("Agentic AI", SkillCategory.AI_ENGINEERING, ProficiencyLevel.ADVANCED, True, 43),
    ("Prompt engineering", SkillCategory.AI_ENGINEERING, ProficiencyLevel.ADVANCED, False, 44),
    ("Embeddings / vector search", SkillCategory.AI_ENGINEERING, ProficiencyLevel.ADVANCED, False, 45),
    ("Power BI", SkillCategory.VISUALIZATION, ProficiencyLevel.EXPERT, True, 50),
    ("Tableau", SkillCategory.VISUALIZATION, ProficiencyLevel.ADVANCED, False, 51),
    ("R Shiny", SkillCategory.VISUALIZATION, ProficiencyLevel.PROFICIENT, False, 52),
    ("HTML5 / CSS", SkillCategory.WEB, ProficiencyLevel.PROFICIENT, False, 60),
    ("Bitbucket", SkillCategory.VERSION_CONTROL, ProficiencyLevel.ADVANCED, False, 70),
    ("Cursor / VS Code", SkillCategory.TOOLING, ProficiencyLevel.ADVANCED, False, 80),
    ("Advanced Excel", SkillCategory.OFFICE, ProficiencyLevel.EXPERT, False, 90),
]

PROJECTS = [
    {
        "slug": "aviation-knowledge-assistant",
        "title": "LLM-powered Aviation Knowledge Assistant",
        "summary": "RAG-style assistant for aviation valuation and analytics teams, grounded in source documents.",
        "kind": ProjectKind.AI,
        "sector": Sector.AVIATION,
        "year": 2026,
        "stack_label": "LLMs, RAG, embeddings, vector search, prompt templates",
        "is_featured": True,
        "sort_order": 1,
        "highlights": [
            "Designed a RAG-style assistant using document ingestion, embeddings, vector search, and prompt templates.",
            "Focused on source-grounded responses to reduce manual lookup time for aviation valuation teams.",
        ],
    },
    {
        "slug": "agentic-analytics-automation",
        "title": "Agentic Analytics Workflow Automation",
        "summary": "Prototype agentic workflows for recurring analysis, validation checks, and report-ready outputs.",
        "kind": ProjectKind.AI,
        "sector": Sector.AVIATION,
        "year": 2026,
        "stack_label": "Agentic AI, Python, planning prompts, validation",
        "is_featured": True,
        "sort_order": 2,
        "highlights": [
            "Prototyped agentic AI workflows for recurring analysis tasks using planning prompts and Python execution.",
            "Added validation checks and report-ready outputs to make the loop repeatable.",
        ],
    },
    {
        "slug": "personal-portfolio",
        "title": "Personal Portfolio Platform",
        "summary": "This site: a FastAPI portfolio with enums, DTOs, tight schemas, repositories, and a service layer.",
        "kind": ProjectKind.FULL_STACK,
        "sector": Sector.PERSONAL,
        "year": 2026,
        "stack_label": "FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite, vanilla JS",
        "is_featured": True,
        "sort_order": 3,
        "highlights": [
            "Separated persistence models, application DTOs, and API schemas so each layer has a single job.",
            "Constrained domain values with StrEnum and SQLAlchemy enum columns stored as portable strings.",
            "Seeded CV content into a relational schema with child highlight tables and a contact inquiry inbox.",
        ],
    },
    {
        "slug": "elearning-polyglot-persistence",
        "title": "Database Development Project",
        "summary": "Polyglot persistence for an e-learning platform using SQLite and Redis, with privacy controls.",
        "kind": ProjectKind.DATA_ENGINEERING,
        "sector": Sector.ACADEMIC,
        "year": 2022,
        "stack_label": "SQLite, Redis, privacy-preserving storage",
        "is_featured": False,
        "sort_order": 4,
        "highlights": [
            "Implemented polyglot persistence for an e-learning platform using SQLite and Redis.",
            "Applied privacy measures to safeguard personal identity data.",
        ],
    },
    {
        "slug": "environmental-image-classification",
        "title": "Machine Learning Application Project",
        "summary": "CNN image classification for environmental analytics, plus statistical analysis of student performance.",
        "kind": ProjectKind.MACHINE_LEARNING,
        "sector": Sector.ACADEMIC,
        "year": 2022,
        "stack_label": "TensorFlow, CNNs, descriptive and inferential statistics",
        "is_featured": False,
        "sort_order": 5,
        "highlights": [
            "Developed an image classification model using CNNs and TensorFlow for an environmental analytics project.",
            "Performed descriptive, inferential, and predictive analysis on student performance datasets.",
        ],
    },
    {
        "slug": "interactive-financial-dashboard",
        "title": "Interactive Financial Dashboard",
        "summary": "Interactive financial dashboard built in R Shiny and hosted on an R Shiny server.",
        "kind": ProjectKind.DASHBOARD,
        "sector": Sector.ACADEMIC,
        "year": 2022,
        "stack_label": "R, R Shiny",
        "is_featured": False,
        "sort_order": 6,
        "highlights": [
            "Designed an interactive financial dashboard using R Shiny, hosted on an R Shiny server.",
        ],
    },
    {
        "slug": "spotify-sentiment-dissertation",
        "title": "Master's Dissertation: Spotify Sentiment and Financial Insight",
        "summary": "Forecasting financial trends from Spotify song sentiment using ARIMA and recurrent networks.",
        "kind": ProjectKind.RESEARCH,
        "sector": Sector.ACADEMIC,
        "year": 2022,
        "stack_label": "Spotify API, ARIMA, RNNs, Python",
        "is_featured": True,
        "sort_order": 7,
        "highlights": [
            "Retrieved song sentiment data via the Spotify API and performed preprocessing including null imputation.",
            "Applied machine learning models including ARIMA and RNNs to forecast financial trends using Spotify metrics.",
        ],
    },
]

MEDIA = [
    {
        "kind": MediaKind.HEADSHOT,
        "title": "Professional headshot",
        "url": "/static/assets/headshot.jpg",
        "alt_text": "Portrait of Shantanu Soni in a navy blazer",
        "sort_order": 1,
    },
    {
        "kind": MediaKind.CV,
        "title": "Curriculum vitae",
        "url": "/static/assets/Shantanu_Soni_CV.pdf",
        "alt_text": "Download Shantanu Soni CV as PDF",
        "sort_order": 2,
    },
]


def seed_database() -> None:
    init_db()
    db = SessionLocal()
    try:
        if db.query(Profile).first() is not None:
            return

        db.add(Profile(**PROFILE))

        for item in EXPERIENCES:
            payload = dict(item)
            highlights = payload.pop("highlights")
            row = Experience(**payload)
            row.highlights = [
                ExperienceHighlight(body=body, sort_order=index)
                for index, body in enumerate(highlights, start=1)
            ]
            db.add(row)

        for item in EDUCATION:
            payload = dict(item)
            highlights = payload.pop("highlights")
            row = Education(**payload)
            row.highlights = [
                EducationHighlight(body=body, sort_order=index)
                for index, body in enumerate(highlights, start=1)
            ]
            db.add(row)

        db.add_all(
            [
                Skill(
                    name=name,
                    category=category,
                    proficiency=proficiency,
                    is_featured=is_featured,
                    sort_order=sort_order,
                )
                for name, category, proficiency, is_featured, sort_order in SKILLS
            ]
        )

        for item in PROJECTS:
            payload = dict(item)
            highlights = payload.pop("highlights")
            row = Project(**payload)
            row.highlights = [
                ProjectHighlight(body=body, sort_order=index)
                for index, body in enumerate(highlights, start=1)
            ]
            db.add(row)

        db.add_all([MediaAsset(**item) for item in MEDIA])
        db.commit()
    finally:
        db.close()
