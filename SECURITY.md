# Security Policy

## Supported Versions

| Version       | Supported |
| ------------- | --------- |
| `main` branch | ✅        |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it by opening a [GitHub Security Advisory](https://github.com/your-username/forge/security/advisories/new) or by contacting the maintainer directly.

Please include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect a response within 48 hours. We will keep you informed of the progress toward a fix and full announcement.

## Security Measures

This project implements the following security practices:

- JWT access tokens stored in memory only (never localStorage)
- Refresh tokens stored in `httpOnly`, `Secure`, `SameSite=Strict` cookies
- Refresh tokens hashed with bcrypt before storage
- Rate limiting on all authentication endpoints
- Input validation with class-validator on all DTOs
- Helmet.js security headers
- CORS restricted to configured `FRONTEND_URL`
- Environment variables validated with Zod on startup
- Passwords hashed with bcrypt (cost factor 12)
