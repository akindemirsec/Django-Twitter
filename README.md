# Django-Twitter

A Twitter-like web application built with Django for the backend and React for the frontend.

## Features![logo](https://github.com/user-attachments/assets/3732f176-9514-4586-8931-4ea5113dcc23)

#


- User authentication (register, login, logout)
- Post tweets
- Like tweets
- Follow users
- View user profiles and their tweets
- Responsive design

## Prerequisites

- Docker
- Docker Compose

## Getting Started

To run the application using Docker, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/akindemirsec/Django-Twitter.git
    cd Django-Twitter
    ```

2. Build and run the Docker containers:

    ```bash
    sudo docker-compose up --build
    ```

    This will build the Docker images and start the containers. The backend will be available at `http://localhost:8000` and the frontend at `http://localhost:3000`.
