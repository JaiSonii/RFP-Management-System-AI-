# AI-Powered RFP Management System

An end-to-end intelligent procurement platform that streamlines the Request for Proposal (RFP) lifecycle. This application allows users to generate structured RFPs from natural language, automatically email vendors, parse incoming email proposals using AI, and rank them to make data-driven decisions.

## 🚀 Features

  * **AI-Driven RFP Creation**: Converts natural language prompts (e.g., "I need 50 laptops...") into structured JSON requirements using LangChain & Zod.
  * **Vendor Management**: Manage vendor contacts and seamlessly select them for bids.
  * **Automated Email Workflow**: Sends RFPs via SMTP and listens for replies via IMAP.
  * **Intelligent Parsing**: Automatically extracts price, timeline, and warranty terms from unstructured vendor emails.
  * **Smart Comparison**: Ranks proposals with AI-generated scoring and reasoning.

-----

## 🛠️ Tech Stack

  * **Frontend**: React, TypeScript, Tailwind CSS, Vite
  * **Backend**: Node.js, Express, TypeScript
  * **Database**: MongoDB (Mongoose ODM)
  * **AI & LLM**: OpenAI GPT-4o-mini, LangChain, Zod (for structured output)
  * **Email Infrastructure**: Nodemailer (SMTP), Imap-simple (IMAP Polling)

-----

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

  * **Node.js** (v18 or higher)
  * **MongoDB** (Running locally on default port `27017` or a cloud URI)
  * **OpenAI API Key**
  * **Gmail Account** (with 2-Step Verification enabled and an **App Password** generated)

-----

## 📦 Installation & Setup

### 1\. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2\. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/rfp-system
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Gmail Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # NOT your login password
```

### 3\. Frontend Setup

```bash
cd ../client
npm install
```

-----

## 🏃‍♂️ Running the Application

### 1\. Start the Backend

The backend runs on Port 3000. It handles API requests and runs the background IMAP listener.

```bash
# In /server terminal
npm run dev
```

*You should see: `Server running on port 3000` and `🔄 Starting IMAP Email Listener...`*

### 2\. Start the Frontend

The frontend runs on Vite's default port (usually 5173).

```bash
# In /client terminal
npm run dev
```

Open your browser to `http://localhost:5173`.

-----

## 📖 API Documentation

### RFP Endpoints

  * **GET** `/api/rfps` - Fetch all RFPs.
  * **POST** `/api/rfp` - Create a new RFP from natural language.
      * *Body:* `{ "prompt": "I need..." }`
  * **POST** `/api/rfp/send` - Email an RFP to selected vendors.
      * *Body:* `{ "rfpId": "...", "vendorIds": ["..."] }`
  * **GET** `/api/rfp/:rfpId/compare` - Get proposals and AI comparison report.

### Vendor Endpoints

  * **GET** `/api/vendors` - List all vendors.
  * **POST** `/api/vendor` - Add a new vendor.
      * *Body:* `{ "name": "...", "email": "...", "contactPerson": "..." }`

-----

## 🧠 Design Decisions & Assumptions

1.  **Structured Output (Zod)**:

      * **Decision**: Instead of asking the LLM for "JSON", I used `LangChain`'s structured output parser with `Zod` schemas.
      * **Reasoning**: This guarantees that the AI response matches the strict TypeScript interfaces required by the database, preventing runtime crashes due to malformed JSON.

2.  **IMAP Polling vs. Webhooks**:

      * **Decision**: Implemented an internal IMAP polling service (checking every 30s) instead of using a SendGrid/Mailgun inbound webhook.
      * **Reasoning**: This allows the application to run entirely locally for the assessment without needing public tunneling (ngrok) or domain verification.

3.  **RFP Reference IDs**:

      * **Assumption**: Vendors will reply to the specific email thread.
      * **Implementation**: A unique reference tag `[Ref:ObjectId]` is injected into the email subject line. The IMAP parser looks for this regex to link incoming emails to the correct RFP in the database.

-----

## 🤖 AI Tools Usage Statement

During the development of this project, I utilized AI tools (ChatGPT/Cursor) to assist with:

  * **Boilerplate Generation**: Setting up the initial Express/Mongoose scaffolding.
  * **Tailwind Styling**: Generating responsive UI components for the dashboard and comparison tables.
  * **Debugging**: Specifically for configuring the `imap-simple` connection to bypass Gmail's certificate mismatch errors during local development.
  * **Prompt Engineering**: Refining the LangChain prompts to ensure the AI extracts warranty information accurately from unstructured text.

-----