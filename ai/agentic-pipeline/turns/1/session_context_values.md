# Session Context Values

## Globals
- sandbox_base_directory: workspace
- agentic-pipeline: codex-agentic-ai-pipeline
- target_project: codex-customer-registration-nextjs-nestjs
- project_context: codex-customer-registration-nextjs-nestjs/ai/context
- turn_task: execute turn 1
- turn_id: 1
- application_implementation_pattern: full-stack-app-nextjs-nestjs
- patterns: [full-stack-app-nextjs-nestjs, spring-boot-mvc-jpa-postgresql]

## Project
- name: Customer Registration
- description_short: Customer Registration is a service that securely captures, validates, and manages new customer data, exposing standardized APIs for onboarding and downstream integrations.
- description_detailed: The Customer Registration project provides a standardized service for securely onboarding new customers into a system. It manages the complete registration lifecycle—from capturing customer details and validating inputs, to persisting records in a relational database, and exposing CRUD operations through a REST API. The system is designed to integrate with enterprise authentication and authorization frameworks, ensuring compliance with data security policies. It also establishes a foundation for downstream processes such as customer profile enrichment, service eligibility checks, and integration with external systems.
- domain_object: Customer
- rest_api_request_schema: ai/context/schemas/customer.schema.json
- rest_api_response_schema: schemas/customer.schema.json
- persisted_data_schema: schemas/customer_domain-entities.json
