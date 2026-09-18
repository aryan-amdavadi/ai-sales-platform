# Security Posture & Controls

This document outlines the security controls, architecture, and policies implemented in the AI Sales Platform.

## 1. Implemented Features

The following security controls are actively enforced in production:

- **Audit Logging**: Comprehensive logging of critical actions, including workspace suspension, CRM integrations, and admin interactions (`AuditLog` model).
- **Security Events**: Tracking of anomalous behavior, failed authentication attempts, and API abuse (`SecurityEvent` model).
- **Fraud & Risk Engine**: An automated `RiskEngine` evaluating workspace utilization and emitting `FraudSignal` objects upon detecting abnormal behaviors (e.g., call volume spikes).
- **API Rate Limiting**: Next.js Middleware-enforced API rate limits (HTTP 429) protecting against DDoS or brute-force enumeration.
- **Secure Response Headers**: Strictly enforced CSP, HSTS, XSS protections, and frame denial (preventing clickjacking).
- **Enterprise Admin Controls**: Isolated admin dashboard to view fraud signals, suspend/unsuspend abusive workspaces, and track usage.

## 2. Prototype Features

The following features exist in a prototype state for local development and are pending production hardening:

- **Internal Billing Simulator**: Simulates usage-based limitations and plan switching without integrating a real payment processor.
- **In-Memory Rate Limiting**: The current rate limiter utilizes an in-memory Map. While suitable for edge-functions handling single regions, it should be migrated to Redis for true distributed enforcement.

## 3. Production Roadmap

Prior to public enterprise launch, the following components must be addressed:

- **Distributed Rate Limiting**: Migrate `rateLimitMap` to Upstash Redis or similar for cross-regional consistency.
- **Credential Encryption (KMS)**: Transition CRM credentials to an external Key Management Service (AWS KMS / Google Cloud KMS) rather than database-level AES encryption.
- **Advanced Identity (SSO/SAML)**: Integrate SAML/OIDC for enterprise tenant onboarding.
- **Vulnerability Scanning**: CI/CD integration of automated dependency auditing and SAST tooling.
