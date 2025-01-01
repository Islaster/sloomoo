# Sloomoo - Server

This directory contains the **backend application** for Sloomoo, an AI-powered project designed to create an interactive poetic journey for users. The server handles API requests, manages real-time communication, integrates AI functionalities, and interacts with AWS S3 for file storage and retrieval.

---

## Features

- **AI Integration**: Generates personalized poems using ChatGPT API.
- **Dynamic Image Generation**: Updates JSON workflows and integrates with ComfyUI to create flux-prompt-based images.
- **Real-Time Communication**: Powered by Socket.IO to provide instant updates and notifications.
- **AWS S3 Integration**: Downloads and serves files from an AWS S3 bucket.
- **File Watching**: Polls the S3 bucket for new files and emits notifications to connected clients.
- **ComfyUI Workflow**: Uses a predefined JSON workflow file for flux-prompt image generation.
- **Secure and Scalable**: Built with Express.js for efficient request handling.

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (version X.X or higher)
- **npm** or **yarn**
- **AWS S3 credentials** (with permissions to read from the bucket)
- **ChatGPT API key**
- **Python** (for executing the ComfyUI API script)
- **ComfyUI** (configured for flux-prompt image generation)

---

## Installation and Setup

1. Navigate to the `server` directory
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Create an .env file in the server directory with the following variables: 
    ```bash
    #Node enviornment 
    NODE_ENV=dev

    # Server port
    PORT=3001

    # Local URLs
    FRONTEND_URL=http://localhost:3000
    SERVER_URL=http://localhost:3001

    #APIS
    CHATGPT_API_KEY='your api key goes here'

    #AWS
    AWS_ACCESS_KEY='your access key goes here'
    AWS_REGION='your region goes here'
    AWS_SECRET_ACCESS_KEY='Your secret key goes here'
    ```
4. Start the server:
    to run dev server
    ```bash
    npm run dev
    ```
    to run production server
    ```bash
    npm start
    ```
## Dependencies
- **Express**: Handles API requests.
- **Socket.IO**: Manages real-time client-server communication.
- **AWS SDK**: Interfaces with AWS S3.
- **Axios**: Makes HTTP requests to external APIs.
- **dotenv**: Manages environment variables.
- **crypto**: Generates secure hashes for files.
