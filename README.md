# Captain Ahab 

An AI Agent that helps you build, deploy, and run Docker containers. 

# ⚠️ RUNNING THIS PROJECT IS SUPER DANGEROUS. USE WITH CAUTION ⚠️

Captain Ahab runs commands on your local machine! We are not responsible for any damage incurred.

## Quickstart Setup

### Prerequisites

- MacOS or Linux
- Docker

### 1. Clone repo
```shell
git clone https://github.com/jumploops/ahab.git
cd ahab 
```

### 2. Set your [OpenAI API key](https://platform.openai.com/api-keys)

```shell
export OPENAI_API_KEY="sk_..."
```

### 3. Install dependencies

```shell
npm install
```

### 4. Run

```shell
npm run dev
```

### 5. Navigate to [http://localhost:3006](http://localhost:3006).

## Overview

This project was personal experiment in using the new Assistants API from OpenAI. It enables you to create and run Docker containers on your local machine using natural language.

### Main Components

- `app/components/chat.tsx` - handles chat rendering, [streaming](https://platform.openai.com/docs/assistants/overview?context=with-streaming), and [function call](https://platform.openai.com/docs/assistants/tools/function-calling/quickstart?context=streaming&lang=node.js) forwarding
- `app/components/terminal.tsx` - handles displaying and interacting with the local machine's terminal 

### Endpoints

- `api/assistants` - `POST`: create assistant (only used at startup)
- `api/assistants/threads` - `POST`: create new thread
- `api/assistants/threads/[threadId]/messages` - `POST`: send message to assistant
- `api/assistants/threads/[threadId]/actions` - `POST`: inform assistant of the result of a function it decided to call

## Thanks

This repo was based off the official [OpenAI Assistants API Quickstart](https://github.com/openai/openai-assistants-quickstart).
