# AI Assignment Generator

An AI-powered assignment and assessment generation platform built using a modern TypeScript monorepo architecture.

The platform enables educators to generate structured assignments from study materials using Large Language Models (LLMs), configure question patterns, manage assessments, and export assignments efficiently.

---

## Features

### Assignment Generation

* Generate assignments using AI
* Multiple question types

  * MCQ
  * True / False
  * Short Answer
  * Long Answer
* Difficulty-based question generation
* Section-wise assignment creation
* Configurable marks and question counts
* Realtime status updation
* Retry Functionality (if server down, when it start again generate pending work)


### AI Integration

* LangChain powered workflows
* Google Gemini integration
* Structured JSON validation using Zod

### Real-Time Updates

* Socket.IO integration
* Real-time assignment generation status
* Background processing support

### File Processing

* PDF upload support
* Automatic PDF text extraction
* Study material parsing

### Developer Experience

* TypeScript throughout the stack
* Turborepo monorepo architecture
* Shared build pipeline
* Zod schema validation
* ESLint configuration

---

# Tech Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* React Query
* React Hook Form
* Zod
* Zustand
* ShadCN UI
* Socket.IO Client

## Backend

* Express.js
* TypeScript
* MongoDB
* Mongoose
* LangChain
* BullMQ
* Redis
* Socket.IO
* Multer

## AI Providers

* OpenAI
* Groq
* Google Gemini

---

# Project Structure

```bash
ai-assignment-generator/

├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       └── package.json
│
├── turbo.json
├── package.json
└── README.md
```

---




# Clone Repository

```bash
git clone https://github.com/dhirajAtpruthatek/aiassignment

cd aiassignment
```

---

# Install Dependencies

From the project root:

```bash
npm install
```

This installs dependencies for all workspace applications.

---


# Development

Run all applications simultaneously:

```bash
npm run dev
```

Turbo will start:

```bash
Frontend  -> http://localhost:3000

Backend   -> http://localhost:9000
```

---
  
 

# Build Project

Build all applications:

```bash
npm build
```

---

# Start Production Build

## Whole app

```bash
npm run build

```
```bash
npm run start
```
  
  
# Assignment Generation Flow

```text
Upload Study Material
          │
          ▼
Extract PDF Content
          │
          ▼
Configure Assignment
          │
          ▼
Send Generation Request
          │
          ▼
AI Generates Questions
          │
          ▼
Zod Validation
          │
          ▼
Store Assignment
          │
          ▼
Real-Time Status Updates
```

---

# Future Improvements

* Assignment templates
* Assignment versioning
* Multi-language generation
* Export to PDF and DOCX
* Teacher dashboard analytics
* AI-generated grading rubric
* Classroom integration

---

# License

This project is licensed under the MIT License.

---

# Author

Dhiraj Suthar

Built with TypeScript, AI, and modern web technologies.
