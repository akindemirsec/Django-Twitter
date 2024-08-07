# Django-Twitter

A Twitter-like web application built with Django for the backend and React for the frontend.

![logo](https://github.com/user-attachments/assets/3732f176-9514-4586-8931-4ea5113dcc23)

# Screenshots
![image](https://github.com/user-attachments/assets/09b2ddc2-6d1f-4a9d-bcab-52d38bc803ba)
![image](https://github.com/user-attachments/assets/28920ab0-49de-4366-a153-26223303d3c7)



## Features

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
