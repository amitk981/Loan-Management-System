You are acting as a senior product designer, UX auditor, prototype reviewer, product requirements analyst, and design systems reviewer.
Your task is to perform a deep, full-repository design audit of this project and create a new living audit file that can be maintained as the project progresses.
This audit must focus on the quality, completeness, clarity, usability, and accuracy of the design prototype.
This is not a backend engineering audit.
You may inspect backend, API, schema, state, or data-flow files only when they affect the user experience, prototype logic, screen behavior, mock data, user flows, empty states, validation states, terminology, or what must be represented in the prototype.
Do not create backend-focused issues such as database optimization, server architecture, API scalability, backend security hardening, backend performance, deployment pipelines, infrastructure, or server refactoring unless they directly block or distort the design prototype experience.
Every issue in the final ledger must answer this question:
“Does this issue affect the quality, clarity, completeness, usability, or accuracy of the design prototype?”
If the answer is no, do not include it in the main issue ledger.

Primary Goal
Create a highly detailed design audit of the complete project by studying:
	1	The entire source repository
	2	The complete docs/ folder
	3	All PDFs or official documentation inside docs/
	4	Existing UI implementation, screens, flows, components, routes, layouts, and styling
	5	Frontend state and user-visible logic
	6	Mock data, sample data, and prototype assumptions
	7	Industrial UI/UX and product design practices where useful
	8	The intended product requirements from official documents
	9	The product from a real user’s point of view
The audit must explain:
	•	What the product is intended to be
	•	Who the users are
	•	What users need to accomplish
	•	What the official docs require
	•	What the prototype must communicate
	•	What screens, flows, and states are missing
	•	What UI/UX problems currently exist
	•	What design decisions are unresolved
	•	What should be fixed first
	•	How to break the work into practical slices
	•	How to maintain the issues as a project ledger
Do not make shallow observations.
Do not only list visual problems.
Do not only comment on code structure.
This audit must combine:
	•	Product understanding
	•	User journey understanding
	•	UI/UX review
	•	Design system review
	•	Accessibility review
	•	Interaction design review
	•	Information architecture review
	•	Business/product requirement mapping
	•	Logical flow analysis
	•	Edge-case and empty-state review
	•	Implementation feasibility notes for prototype purposes only
	•	A maintainable issue ledger

Required Use of Matt Pocock Skills
Before starting the audit, check whether the repository has access to the skills from:
https://github.com/mattpocock/skills
If the skills are not installed, use the appropriate setup process for the agent environment, including:
npx skills@latest add mattpocock/skills
Then run the setup skill if available:
/setup-matt-pocock-skills
Use the skills from mattpocock/skills wherever they improve the quality of the audit, planning, design reasoning, prototype reasoning, or issue breakdown.
Use skills appropriately. Do not force every skill into the task.
Recommended Skill Usage
/grill-with-docs
Use this when official docs, PDFs, product requirements, or prototype expectations are ambiguous.
Apply it to:
	•	Extract product language from docs
	•	Identify unclear requirements
	•	Challenge assumptions
	•	Build shared terminology
	•	Detect missing product decisions
	•	Record open questions
	•	Improve alignment between docs, UI, and prototype goals
Do not use it to expand backend scope. Keep the grilling focused on design prototype clarity, user flows, product intent, and requirements.
/zoom-out
Use this during the codebase scan when a file, route, component, or flow is hard to understand in isolation.
Apply it to:
	•	Understand how screens connect
	•	Understand how components support the full prototype
	•	Map routes to user journeys
	•	Identify where a UI slice begins and ends
	•	Explain unfamiliar areas in the context of the whole product
The goal is to understand the prototype as a complete user-facing system, not just isolated files.
/prototype
Use this only if it helps clarify design decisions or missing UI states.
Apply it to:
	•	Explore alternative screen layouts
	•	Compare multiple UI approaches
	•	Flesh out unclear flows
	•	Model missing states
	•	Test whether a user journey makes sense
Do not build production features. Any prototype work should be disposable and used only to inform the audit.
/to-issues
Use this after the audit findings are clear.
Apply it to:
	•	Convert audit findings into slice-based design/prototype issues
	•	Keep issues independently actionable
	•	Ensure each issue has a clear user impact
	•	Ensure each issue has acceptance criteria
	•	Avoid mixing unrelated problems into one issue
Every generated issue must remain focused on design prototype quality, UI/UX, user-visible logic, or requirement representation.
/triage
Use this to organize the issue ledger.
Apply it to:
	•	Assign severity
	•	Assign priority
	•	Mark issue status
	•	Separate prototype blockers from polish issues
	•	Keep the ledger maintainable as the project progresses
/handoff
Use this at the end if the audit is large enough that another agent, designer, or developer may continue the work.
The handoff should summarize:
	•	What was reviewed
	•	What was found
	•	What files matter most
	•	What docs/PDFs drove the requirements
	•	What issues are highest priority
	•	What open questions remain
	•	What should be done next
Skill Usage Rules
Use skills only when appropriate.
Do not use backend-focused skills or backend-style analysis unless it directly affects the design prototype.
Do not let the skills shift the task into backend architecture, infrastructure, deployment, database design, API optimization, or general refactoring.
The central question remains:
“Does this finding affect the quality, clarity, completeness, usability, or accuracy of the design prototype?”
If yes, include it.
If no, exclude it from the main issue ledger.

In-Depth Codebase Scan Requirements
Perform a detailed scan of the codebase, including but not limited to:
	•	Routes
	•	Pages
	•	Screens
	•	Components
	•	Layout files
	•	Navigation structure
	•	Styling files
	•	Design tokens
	•	Theme configuration
	•	CSS files
	•	Tailwind configuration
	•	UI library usage
	•	Forms
	•	Input controls
	•	Tables
	•	Cards
	•	Lists
	•	Modals
	•	Drawers
	•	Dialogs
	•	Empty states
	•	Error states
	•	Loading states
	•	Success states
	•	Placeholder data
	•	Mock data
	•	Hardcoded copy
	•	Icons
	•	Assets
	•	Responsive behavior
	•	Accessibility attributes
	•	Frontend state management
	•	User-visible validation logic
	•	Conditional rendering
	•	Any code that controls what users see, click, read, or understand
When scanning backend or non-UI files, only extract insights that are relevant to the prototype experience, such as:
	•	What data the UI appears to expect
	•	What user roles or entities exist
	•	What flows the UI should represent
	•	What states the prototype needs to show
	•	What business rules are user-visible
	•	What terminology should appear in the interface
	•	What edge cases need a design state
Do not turn backend implementation concerns into design audit issues unless they affect the prototype.

Prototype-Focused Boundary
The issues you create must be based on:
	•	Design prototype requirements
	•	UI/UX quality
	•	User journeys
	•	Visual design
	•	Interaction design
	•	Accessibility
	•	Product logic visible to users
	•	Information architecture
	•	Screen states
	•	Content and microcopy
	•	Requirements extracted from official docs and PDFs
	•	Missing flows or unclear behavior needed for prototype completion
Include issues such as:
	•	Missing onboarding screen
	•	Confusing dashboard hierarchy
	•	Poor empty state
	•	Missing loading state
	•	Form labels are unclear
	•	User role is not reflected in navigation
	•	PDF requirement is not represented in UI
	•	Inconsistent CTA behavior
	•	Missing mobile layout
	•	Missing accessibility state
	•	Prototype does not show required approval flow
	•	Current screen does not communicate user goal clearly
	•	Required state transition is not visible to users
	•	Prototype lacks confirmation or review moment
	•	Official terminology is not used in the interface
Do not include issues such as:
	•	Database indexing
	•	API refactor recommendation
	•	Server-side caching
	•	Authentication internals
	•	Deployment setup
	•	Backend framework structure
	•	Infrastructure concerns
	•	Code style issues unrelated to UI
	•	Backend scalability
	•	Logging/monitoring unless user-visible
	•	Security implementation unless it changes the prototype experience

Official Docs and PDFs
Use the official PDFs and documents in the docs/ folder as the source of truth for intended product requirements.
When you infer requirements from them, clearly mark each requirement as one of:
	•	Explicit requirement
	•	Implied requirement
	•	Design assumption
	•	Open question
If a PDF or document cannot be read properly, mention that clearly in the audit and list what could not be verified.
Do not invent requirements that are not present in the official docs.
If something seems necessary for the prototype but is not documented, add it to the Open Questions section.

Output File
Create a new markdown file at:
docs/DESIGN_AUDIT_LEDGER.md
If the docs/ folder does not exist, create it.
This file must be structured as a living design audit and issue ledger that can be updated throughout the project.
Do not modify application code unless explicitly requested.
This task is for creating the audit file only.

Required Structure of docs/DESIGN_AUDIT_LEDGER.md
1. Executive Summary
Summarize the current design maturity and prototype readiness.
Include:
	•	Overall UX quality
	•	Current prototype readiness
	•	Biggest design risks
	•	Biggest missing user flows
	•	Biggest prototype gaps
	•	Biggest opportunities
	•	Whether the current UI matches the official docs
	•	Whether the user journey is clear
	•	Whether the product can be understood by a first-time user
	•	Immediate design priorities
	•	Highest-priority UX fixes

2. Source Material Reviewed
List every source reviewed.
Include:
	•	Repository folders/files inspected
	•	UI files inspected
	•	Styling/config files inspected
	•	PDFs reviewed from docs/
	•	Markdown/docs reviewed
	•	Design assets reviewed
	•	Mock data reviewed
	•	Files that could not be read
For each official PDF/doc, mention:
	•	Filename
	•	Major requirements extracted
	•	Design expectations extracted
	•	Areas of ambiguity
	•	Whether anything could not be verified

3. Product and Prototype Understanding
Explain what the product appears to be.
Include:
	•	Target users
	•	Primary user goals
	•	Core jobs-to-be-done
	•	Main product value proposition
	•	Key workflows
	•	User roles, if any
	•	Expected user mental model
	•	What the product must make obvious to users
	•	What the prototype must demonstrate
	•	What the official docs imply the prototype should communicate
	•	Where the current implementation supports or fails that understanding

4. Requirements Extracted From Official Docs
Create a requirements table.
Use this format:
Req ID
Requirement
Source
Type
Related Prototype Flow
Current UI Status
Notes
Each row should include:
	•	Requirement ID
	•	Requirement description
	•	Source document/PDF
	•	Whether explicit or implied
	•	Related prototype/user flow
	•	Current implementation status
	•	Notes or gaps
Requirement types:
	•	Explicit requirement
	•	Implied requirement
	•	Design assumption
	•	Open question

5. Codebase-to-Prototype Mapping
Map the codebase to the design prototype.
Use this format:
Area
Files/Folders
User-Facing Purpose
Prototype Relevance
Observations
This section should explain how the existing codebase translates into:
	•	Screens
	•	User flows
	•	UI states
	•	Prototype requirements
	•	User-visible logic
	•	Content structure
	•	Navigation structure

6. User Journey Audit
Audit the product from a user’s point of view.
Break down the experience into journey stages such as:
	•	First impression
	•	Landing or entry point
	•	Onboarding
	•	Navigation
	•	Core task completion
	•	Data input
	•	Review/confirmation
	•	Error recovery
	•	Empty states
	•	Success states
	•	Returning-user experience
For each stage, document:
	•	What the user is trying to do
	•	What the UI currently communicates
	•	Current UI behavior
	•	Prototype expectation
	•	Where confusion may happen
	•	What is missing
	•	What should be improved
	•	Severity of the issue

7. Slice-Based Prototype Audit
Divide the product into practical feature slices or user-flow slices.
Adapt the slices to the actual repository.
Possible slices include:
	•	Landing / Entry Flow
	•	Authentication or User Identification Flow
	•	Dashboard / Home
	•	Navigation / Information Architecture
	•	Main Creation Flow
	•	Main Editing Flow
	•	Review / Preview Flow
	•	Approval / Submission Flow
	•	Settings / Preferences
	•	Error and Edge Cases
	•	Empty States
	•	Loading States
	•	Mobile Responsiveness
	•	Accessibility
	•	Visual Design System
	•	Content and Microcopy
For each slice, include:
	•	Slice name
	•	User goal
	•	Relevant files/components
	•	Current implementation summary
	•	Expected prototype behavior based on docs
	•	UI/UX issues
	•	Logical/product issues visible to users
	•	Missing screens/states
	•	Accessibility concerns
	•	Recommended improvements
	•	Acceptance criteria

8. UI/UX Heuristic Review
Review the product using strong industry design principles, including:
	•	Nielsen usability heuristics
	•	WCAG accessibility expectations
	•	Responsive design best practices
	•	Design system consistency
	•	Visual hierarchy
	•	Cognitive load reduction
	•	Error prevention
	•	Recognition over recall
	•	User control and freedom
	•	Feedback and system status
	•	Consistency and standards
	•	Minimalism and clarity
For each heuristic, mention:
	•	What works
	•	What does not work
	•	Specific examples from the repository
	•	File/component evidence
	•	Prototype impact
	•	Recommendations

9. Visual Design Audit
Review:
	•	Layout
	•	Spacing
	•	Typography
	•	Color usage
	•	Contrast
	•	Iconography
	•	Component consistency
	•	Alignment
	•	Density
	•	Hierarchy
	•	Visual grouping
	•	CTA clarity
	•	Responsive behavior
	•	Design polish
Be extremely specific.
Mention exact screens, components, or files where possible.

10. Interaction Design Audit
Review:
	•	Click/tap targets
	•	Hover states
	•	Focus states
	•	Form behavior
	•	Validation behavior
	•	Loading behavior
	•	Modal/dialog behavior
	•	Navigation behavior
	•	Transitions/animations
	•	Disabled states
	•	Undo/cancel flows
	•	Confirmation patterns
	•	Keyboard accessibility
	•	Mobile interactions

11. Accessibility Audit
Review against accessibility expectations.
Include:
	•	Semantic HTML
	•	Keyboard navigation
	•	Focus visibility
	•	ARIA usage
	•	Color contrast
	•	Text size
	•	Form labels
	•	Error messaging
	•	Screen reader clarity
	•	Reduced motion considerations
	•	Touch target sizes
Mark issues that could block users with disabilities as high priority.

12. User-Visible Logic and Flow Audit
Review only logic that affects the prototype or user experience.
Include:
	•	Broken or unclear user flows
	•	Missing business rules visible to users
	•	Unclear state transitions
	•	Missing validations
	•	Ambiguous data relationships
	•	Inconsistent terminology
	•	Places where the UI suggests behavior that the logic does not support
	•	Places where the docs require behavior that is not implemented
	•	Edge cases that need design decisions
	•	Prototype states that are implied by the logic but not represented in the UI
Do not include backend-only implementation issues.

13. Content and Microcopy Audit
Review all user-facing text.
Include:
	•	Clarity
	•	Tone
	•	Consistency
	•	Error messages
	•	Empty state copy
	•	Button labels
	•	Page titles
	•	Instructional text
	•	Form labels
	•	Help text
	•	Confirmation messages
	•	Terminology alignment with official docs
Recommend improved copy where needed.

14. Prototype-Focused Issue Ledger
Create a maintainable issue ledger of design/product/prototype issues.
Every issue must be relevant to design prototype quality.
Use this table:
ID
Status
Severity
Priority
Slice
Issue
Prototype Impact
User Impact
Evidence
Recommendation
Acceptance Criteria
Dependencies
Owner
Notes
Each issue must include:
	•	Where it appears
	•	Why it matters to the prototype
	•	Why it matters to users
	•	Evidence from files/docs/PDFs
	•	Recommended fix
	•	Clear acceptance criteria
	•	Dependencies, if any
	•	Owner placeholder
	•	Notes
Use these statuses:
	•	Open
	•	In Progress
	•	Blocked
	•	Needs Design Decision
	•	Ready for Implementation
	•	Done
	•	Won’t Fix
Use these severity levels:
	•	Critical
	•	High
	•	Medium
	•	Low
	•	Polish
Use these priorities:
	•	P0
	•	P1
	•	P2
	•	P3
Avoid vague issue descriptions like:
“Improve the design.”
Instead write actionable issues such as:
“The primary CTA on src/components/... does not explain the next action. Replace it with a task-specific label that matches the user’s goal, and verify that the click leads to the expected prototype flow.”

15. Excluded Backend/Engineering Notes
If backend, infrastructure, or engineering concerns are noticed but are not relevant to the prototype, list them briefly here as excluded observations.
Do not add them to the main issue ledger.
Examples of excluded observations:
	•	Database performance concern
	•	API architecture concern
	•	Server refactor opportunity
	•	Deployment issue
	•	Infrastructure improvement
	•	Backend code organization concern
Only mention them briefly if they were discovered during the scan.

16. Recommended Prototype Roadmap
Group the work into practical phases:
	•	Phase 1: Prototype blockers and requirement gaps
	•	Phase 2: Core user journey improvements
	•	Phase 3: Missing states and user-visible logic
	•	Phase 4: Accessibility and responsive design
	•	Phase 5: Visual polish and design system consistency
For each phase, list:
	•	Issues included
	•	Why they matter
	•	Expected prototype outcome

17. Open Questions
List all questions that need clarification from product, design, business, or stakeholder teams.
Group them by:
	•	Product requirements
	•	User roles
	•	Prototype scope
	•	Data and user-visible logic
	•	Visual design
	•	Accessibility
	•	Technical feasibility affecting UI only
	•	Missing docs or ambiguous docs

18. Skill Usage Notes
Document how the Matt Pocock skills were used.
Use this format:
Skill
Used?
Why It Was Used
Output/Impact
Include skills that were useful.
Also mention relevant skills that were intentionally not used and why.
Do not over-document tool mechanics.
Focus on how each skill improved the design audit, issue breakdown, requirement analysis, or prototype reasoning.

19. Final Recommendations
End with a clear summary of:
	•	Top design prototype blockers
	•	Highest-impact UX fixes
	•	Most important missing screens/states
	•	Requirements that are not yet represented in the UI
	•	What must be clarified before continuing design
	•	What should be fixed first
	•	What the product needs in order to feel prototype-ready or production-ready

Evidence Rules
Whenever possible, cite evidence from:
	•	File paths
	•	Component names
	•	Route names
	•	PDF/document names
	•	Requirement sections
	•	Screens or flows
	•	Code comments
	•	Existing UI behavior
	•	Styling files
	•	Mock data
	•	Design assets
If something is inferred, label it clearly as an inference.
Do not invent requirements that are not present in the official docs.
If something seems necessary but is not documented, add it to the Open Questions section.

Quality Bar
The audit should be extremely detailed, practical, and actionable.
For every issue, avoid vague language like:
	•	“Make this better”
	•	“Improve UI”
	•	“Fix UX”
	•	“Polish screen”
	•	“Needs work”
Instead, write:
	•	What exactly is wrong
	•	Why it matters to the user
	•	Why it matters to the prototype
	•	Where it appears
	•	What should replace it
	•	How to verify the fix
	•	What requirement or user need it supports
Every issue should be independently understandable and actionable.

Final Chat Summary
After creating the file, provide a short summary in the chat containing:
	1	File created
	2	Number of docs/PDFs reviewed
	3	Number of repository areas scanned
	4	Number of prototype slices audited
	5	Number of design/prototype issues logged
	6	Top 5 highest-priority issues
	7	Backend/engineering concerns intentionally excluded
	8	Matt Pocock skills used
	9	Any files or PDFs that could not be reviewed
Remember: the goal is to create a living design audit and issue ledger that can guide the project throughout future design and development work, while staying focused on design prototype creation rather than backend implementation.