# Campus Print Management System

## Overview

Campus Print is a full-stack web application for managing document printing services on a campus. Students can upload documents, customize printing options, and submit print requests, while administrators can manage and process all printing requests through a dedicated dashboard. The system provides instant cost calculations, secure file handling, and role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Web Framework
The application uses Flask as the primary web framework, chosen for its simplicity and flexibility in building web applications with Python. Flask provides essential features like routing, templating, and request handling while remaining lightweight and extensible.

### Database Layer
SQLAlchemy ORM is used with SQLite as the database backend. This combination provides:
- Object-relational mapping for easier database interactions
- Database portability between development and production
- Built-in connection pooling and query optimization
- Support for database migrations and schema changes

The database schema includes two main entities:
- **User**: Stores user authentication data and role information (student/admin)
- **PrintRequest**: Manages document upload metadata, printing preferences, and request status

### Authentication System
Dual authentication approach:
- **Flask-Login**: Handles session-based authentication for web interface interactions
- **JWT (JSON Web Tokens)**: Provides stateless authentication for API endpoints

This hybrid approach allows for both traditional web sessions and modern token-based authentication, supporting both server-rendered pages and potential API consumers.

### File Management
Document uploads are handled through Flask's built-in file upload capabilities with:
- Secure filename generation to prevent directory traversal attacks
- File type validation (PDF, DOC, DOCX only)
- Size limitations (16MB maximum)
- Organized file storage in dedicated upload directory

### Frontend Architecture
Server-side rendered templates using Jinja2 templating engine with:
- **Bootstrap 5**: Provides responsive grid system and pre-built components
- **Font Awesome**: Icon library for consistent visual elements
- **Vanilla JavaScript**: Handles client-side interactions without framework dependencies
- **Dark theme design**: Custom CSS implementing the specified dark gray/yellow color scheme

### Security Measures
- Password hashing using Werkzeug's security utilities
- CSRF protection through Flask's built-in mechanisms
- File type validation and secure file handling
- Role-based access control separating student and admin functionalities
- Environment-based configuration for sensitive data

### Application Structure
The application follows a modular architecture with separation of concerns:
- **app.py**: Application factory and configuration
- **models.py**: Database models and relationships
- **routes.py**: Request handlers and business logic
- **templates/**: HTML templates with inheritance structure
- **static/**: CSS, JavaScript, and asset files

## External Dependencies

### Python Packages
- **Flask**: Web application framework
- **Flask-SQLAlchemy**: Database ORM integration
- **Flask-Login**: User session management
- **Flask-JWT-Extended**: JWT token handling
- **Werkzeug**: WSGI utilities and security functions

### Frontend Libraries
- **Bootstrap 5**: CSS framework for responsive design and components
- **Font Awesome 6**: Icon library for user interface elements

### Database
- **SQLite**: Embedded database for development and small-scale deployments
- **SQLAlchemy**: Database abstraction layer and ORM

### Infrastructure
- **ProxyFix**: Handles proxy headers for deployment behind reverse proxies
- Built-in development server for local testing
- Environment variable configuration for deployment flexibility