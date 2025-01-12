# Project Overview

This project is designed following the **Domain-Driven Design (DDD)** principles and implemented within a **serverless architecture**. It promotes a modular structure with decoupled, isolated, and independent modules, facilitating scalability and maintainability.

## Architecture Overview

The architecture employs a **layered approach**, ensuring separation of concerns across the following layers:

1. **Presentation Layer**:

   - Represented by the `functions` directory in each module.
   - Contains the entry points (handlers) that expose endpoints to interact with the system.
   - Responsible for initiating business logic execution and managing input/output schemas.

2. **Domain Layer**:

   - The **single source of truth** for business logic, encapsulating the core functionalities of the system.
   - Responsible for all the business rules, validations, and domain-specific operations.
   - Designed to be **independent** of external systems or frameworks, focusing solely on domain entities and rules.
   - Communicates with the **Infrastructure Layer** through repositories for data persistence.

3. **Infrastructure Layer**:

   - Represented by the `repository` directory.
   - Manages data access, external API calls, and other external communications.
   - Abstracts technical complexities to ensure the domain layer remains focused on business logic.

4. **Shared Layer**:

   - Located at the `shared` directory.
   - Contains utilities and services that can be reused across all modules, ensuring cross-module functionality and reducing redundancy.
   - Examples include database connection management, common utility functions, and shared types.

### Benefits of This Architecture

- **Scalability**: Modules are designed to be independently deployable, reducing bottlenecks in team collaboration and system scaling.
- **Decoupling**: Each module operates in isolation, minimizing dependencies and enabling easier testing, development, and deployment.
- **Modularity**: The vertical slicing approach allows teams to focus on specific functionalities, improving maintainability and collaboration.

### Module Structure

Each module encapsulates its own domain, containing:

- `functions/`: Handlers for managing incoming requests.
- `domain/`: Core business logic and entities.
- `repository/`: Infrastructure-specific implementations, such as database access.
- `types/`: Shared TypeScript definitions within the module.

The `shared` directory contains:

- `libs/`: Database-related utilities, such as connection pooling and scripts for schema and data management, and other services that can be used across modules.
- `utils/`: Common utility functions that can be used across modules.
- `types/`: Shared types that can be imported across the project to maintain consistency.

Examples of modules in this project:

- **Analytics Module**: Handles analytics-related logic.
- **Pets Module**: Manages CRUD operations for pets.

---

## Environment Variables

For this project, global environment variables are defined directly within the `serverless.yml` of each module for simplicity. These variables include database credentials, such as:

```yaml
provider:
  name: aws
  runtime: nodejs20.x
  environment:
    STAGE: ${self:provider.stage}
    DB_NAME: postgres
    DB_PORT: 5432
    DB_HOST: aws-0-us-west-1.pooler.supabase.com
    DB_USER: postgres.dkxyzkmrpwmtpqdwjswp
    DB_PASSWORD: yqk@cje3rtp3HYK9jpv
```

The database is hosted on **Supabase**, and the credentials are used to connect to the database securely.

### Note:

In a real-world production environment, it is recommended to manage sensitive data using AWS Secrets Manager or SSM Parameter Store. These tools provide a more secure and scalable way to handle environment variables and secrets, avoiding hardcoding them into configuration files.

Additionally, please note that the database hosted on Supabase will be **deleted** after the project has been reviewed as this is a deliverable for a job interview and not a production-grade project.

---

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x or higher.
- **AWS**: Ensure your AWS CLI credentials are set up. [More info here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Deployment

Modules can be deployed individually to ensure isolated scalability. To deploy a specific module, navigate to its directory and run:

```bash
serverless deploy -s <STAGE> --verbose
```

Example:

```bash
serverless deploy -s devBlue --verbose
```

Once deployed, the generated endpoints will be displayed, allowing you to test the API. Note that there is **no authorization** implemented in this project, so all endpoints are open for testing.

The **Serverless Framework** prints the URLs of all deployed endpoints to the console. Use these URLs to interact with the API.

This project uses the **Serverless Framework**, which allows defining infrastructure as code (IaC). Each module contains its own `serverless.yml` file located at the root of the module. This file defines the necessary infrastructure and functions for the module. By separating the `serverless.yml` for each module, we ensure modularity and independent deployment of features.

This approach allows deploying only the necessary functionalities without affecting other parts of the system.

---

## Local Development

To run the API locally, the project uses the **serverless-offline** plugin. This enables testing the API without deploying it to AWS.

### Running Locally
1. Navigate to the root of the module you want to test.
2. Start the serverless-offline environment with the following command:
   ```bash
   serverless offline -s <STAGE>
   ```

   Example:
   ```bash
   serverless offline -s devBlue
   ```

This will start a local server that simulates the API endpoints for the specified stage, allowing you to test the functionality locally.

---

## Test

Tests are written in the **domain layer**, where the business logic resides. For this project, tests have been implemented for the following:

- **Analytics Module**: Validates the business logic for analytics-related operations.
- **Get-Pets Function**: Ensures the correctness of the `getPets` logic in the Pets module.

### Running Tests

To execute the tests, use the following command:

```bash
npm run test
```

The test framework will automatically find and execute all test files located in the domain layer of the respective modules. These tests ensure the business logic functions as intended.

---

## SQL Scripts

All the SQL scripts used to build the data layer are located in:

```
src\shared\libs\services\db\scripts.sql
```

This file contains:

- The schema definitions for the database.
- Sample data inserted for testing purposes.

These scripts ensure the database structure and test data are consistent with the project's requirements.

---

## API Documentation

This project provides the following endpoints:

### Pets Module

1. **Create a Pet**

   - **Endpoint**: `POST /pets`
   - **Request Body**:
     ```json
     {
       "name": "Buddy",
       "type": "dog",
       "age": 5,
       "owner_name": "John Doe"
     }
     ```
   - **Response**:
     ```json
     {
       "data": {
         "id": "123e4567-e89b-12d3-a456-426614174000",
         "name": "Buddy",
         "type": "dog",
         "age": 5,
         "owner_name": "John Doe"
       },
       "success": true
     }
     ```

2. **Retrieve All Pets (Paginated)**

   - **Endpoint**: `GET /pets`
   - **Query Parameters**:
     - `page`: The current page number (required).
     - `pageSize`: The number of items per page (required).
   - **Response**:
     ```json
     {
       "data": [
         {
           "id": "123e4567-e89b-12d3-a456-426614174000",
           "name": "Buddy",
           "type": "dog",
           "age": 5,
           "owner_name": "John Doe"
         }
       ],
       "total": 100,
       "page": 1,
       "totalPages": 10
     }
     ```

3. **Update a Pet**

   - **Endpoint**: `PATCH /pets/:id`
   - **Request Body**:
     ```json
     {
       "name": "Max",
       "age": 6
     }
     ```
   - **Response**:
     ```json
     {
       "data": {
         "id": "123e4567-e89b-12d3-a456-426614174000",
         "name": "Max",
         "type": "dog",
         "age": 6,
         "owner_name": "John Doe"
       },
       "success": true
     }
     ```

4. **Delete a Pet**

   - **Endpoint**: `DELETE /pets/:id`
   - **Response**:
     ```json
     {
       "success": true
     }
     ```

### Analytics Module

1. **Retrieve Analytics**
   - **Endpoint**: `GET /analytics`
   - **Response**:
     ```json
     {
       "total_pets": 19,
       "data": {
         "type_statistics": [
           {
             "type": "dog",
             "total_pets": "7"
           },
           {
             "type": "cat",
             "total_pets": "6"
           }
         ],
         "age_range_statistics": [
           {
             "type": "hamster",
             "max_age": 1,
             "min_age": 1
           },
           {
             "type": "rabbit",
             "max_age": 4,
             "min_age": 1
           }
         ],
         "avg_age_statistics": [
           {
             "type": "cat",
             "average_age": "3.67"
           },
           {
             "type": "dog",
             "average_age": "5.00"
           }
         ]
       },
       "success": true
     }
     ```
   - **Note**: The URL for this endpoint will be printed to the console after deployment by the Serverless Framework.

---

## About Serverless Architecture

This project utilizes the **serverless architecture**, which eliminates the need for managing traditional servers, allowing the system to scale based on demand. The serverless approach ensures:

- Cost-efficiency by paying only for the compute resources consumed.
- Simplified deployments with predefined configurations in `serverless.yml` files.

