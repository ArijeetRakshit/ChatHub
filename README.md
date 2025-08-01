# ChatHub - Scalable Real-Time Chat Application

ChatHub is a scalable, real-time chat application built using a microservices architecture. It enables real-time messaging between users through horizontally scalable backend instances powered by Socket.IO, with Redis Pub/Sub handling distributed communication. MongoDB is used for persistent storage, and the entire system is containerized using Docker and orchestrated via Docker Compose.

## Features

- User registration and authentication via dedicated Auth Service (MongoDB-backed)
- Real-time chat using Socket.IO
- Cross-instance communication through Redis Pub/Sub
- Chat history stored in MongoDB for message continuity
- Multiple Next.js clients to simulate concurrent users (CSR only)
- Containerized architecture with Docker and Docker Compose
- Modular microservices for scalability and maintainability

## Architecture Overview

- Authentication Service → Handles login and registration
- Chat Service (scalable) → Manages real-time messaging via Socket.IO
- Redis → Facilitates Pub/Sub messaging between chat service instances
- MongoDB → Stores user credentials and chat history
- Next.js Clients → Simulate frontend users (CSR)
- Docker + Docker Compose → Containerized orchestration of all services

## Getting Started

1. Clone the repository
2. Ensure Docker is installed
3. Run:
   ```bash
   docker-compose up --build
