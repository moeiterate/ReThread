# Security Audit (Phase 0)

**When to Use:** Before production deployment. Ideally during development, not just at the end.

**Context Needed:** Working codebase, deployment environment, data sensitivity level.

---

## Prompt

```
Act as an expert security researcher specializing in code auditing. You are tasked with conducting a thorough security audit of the provided codebase.

**Objective:** Identify, prioritize, and propose remediation strategies for high-priority security vulnerabilities that could lead to system compromise, data breaches, unauthorized access, denial of service, or other significant security incidents.

## Phase 0: Scoping & Context Gathering

Please ask clarifying questions about:
- Programming language(s) and framework(s)
- Application purpose and sensitivity level (e.g., internal tool, public app, handles PII)
- Key third-party dependencies
- Deployment environment (cloud provider, containerized, etc.)
- How the codebase will be provided

Define the threat model appropriate for this application.

---

After Phase 0, proceed with full audit following the structured process from:
https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de
```

---

## Usage Notes

- **Run before production** - Don't wait until launch day
- **Provide specific context** - "Handles PII" triggers different checks than "internal tool"
- **Full process is comprehensive** - The gist link is detailed, follow it completely
- **Fix Critical/High first** - Don't launch with known critical vulns
- **Re-audit after fixes** - Ensure fixes don't introduce new issues

---

## Full Security Audit Process

This prompt is Phase 0 (scoping). The complete methodology is here:

👉 **[Complete Security Audit Process](https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de)**

That guide covers:
- **Phase 1:** Analysis & Vulnerability Identification
- **Phase 2:** Remediation Planning
- **Phase 3:** Implementation Proposal & Verification

---

## What to Expect

### Questions AI Should Ask (Phase 0)

**About your app:**
- What language/framework? (Node.js, Python, Go, etc.)
- What type of app? (API, web app, mobile backend, etc.)
- Who uses it? (Internal, public, specific industry)
- What data does it handle? (PII, health records, financial, etc.)

**About deployment:**
- Where deployed? (AWS, Azure, Vercel, self-hosted)
- Containerized? (Docker, Kubernetes)
- What services? (Database type, storage, caching, etc.)

**About your security posture:**
- Any compliance requirements? (HIPAA, SOC2, GDPR)
- Authentication method? (JWT, sessions, OAuth)
- Existing security measures? (WAF, rate limiting, etc.)

### What Good Audit Output Looks Like

Should include:

**1. Severity Classification**
```
CRITICAL: SQL injection in /api/users endpoint (line 45)
HIGH: Missing authentication on admin routes
MEDIUM: Weak password requirements (6 chars minimum)
LOW: Verbose error messages leak stack traces
```

**2. Specific Locations**
```
File: src/api/users.ts
Line: 45
Code: `db.query(\`SELECT * FROM users WHERE id = ${userId}\`)`
Issue: Unsanitized user input in SQL query
```

**3. Remediation Steps**
```
Fix:
- Use parameterized queries
- Example: db.query('SELECT * FROM users WHERE id = $1', [userId])
- Validate userId is actually a number before query
```

**4. Verification Plan**
```
Test:
1. Attempt SQL injection: ?userId=1' OR '1'='1
2. Should return error, not all users
3. Check logs don't expose query structure
```

---

## OWASP Top 10 Focus Areas

The audit should cover these (minimum):

1. **Broken Access Control**
   - Can users access resources they shouldn't?
   - Are there insecure direct object references (IDOR)?

2. **Cryptographic Failures**
   - Are passwords hashed (not encrypted)?
   - Is sensitive data encrypted at rest/in transit?

3. **Injection**
   - SQL injection, NoSQL injection, command injection
   - XSS (cross-site scripting)

4. **Insecure Design**
   - Missing rate limiting
   - No abuse prevention
   - Weak business logic

5. **Security Misconfiguration**
   - Default credentials still active
   - Verbose error messages
   - Unnecessary features enabled

6. **Vulnerable Components**
   - Outdated dependencies
   - Known CVEs in packages

7. **Authentication Failures**
   - Weak password policy
   - No MFA available
   - Session fixation issues

8. **Software and Data Integrity Failures**
   - No input validation
   - Insecure deserialization
   - Missing integrity checks

9. **Logging and Monitoring Failures**
   - No audit logs
   - Sensitive data in logs
   - No alerting on suspicious activity

10. **Server-Side Request Forgery (SSRF)**
    - User-controlled URLs
    - Internal network access from user input

---

## Common Vulnerabilities by Stack

### Next.js / React
- XSS via dangerouslySetInnerHTML
- Exposed API keys in client code
- Missing CSRF protection on forms
- Insecure API route authentication

### Node.js / Express
- SQL/NoSQL injection
- Prototype pollution
- Path traversal in file operations
- Unvalidated redirects

### Python / Django/Flask
- SQL injection (raw queries)
- SSRF via user-provided URLs
- Insecure deserialization (pickle)
- Missing CSRF tokens

### Database (any)
- Missing Row-Level Security (RLS)
- Weak connection string in code
- No encryption at rest
- Overly permissive user roles

---

## Priority: What to Fix First

### Must Fix Before Production
- ✅ **CRITICAL** - Remote code execution, SQL injection, auth bypass
- ✅ **HIGH** - Data exposure, privilege escalation, XSS in core features

### Fix Soon After Launch
- ⚠️ **MEDIUM** - Rate limiting, weak passwords, verbose errors
- ⚠️ **LOW** - Information disclosure, minor config issues

### Can Defer (But Document)
- 📝 **INFORMATIONAL** - Best practice suggestions, code quality

---

## Documentation Requirements

After audit, create `SECURITY.md` in your repo:

```markdown
# Security

## Reporting Issues
Email: security@yourcompany.com

## Known Limitations
- [List any accepted risks]
- [With rationale for each]

## Security Controls
- Authentication: NextAuth.js with email + Google OAuth
- Authorization: Row-Level Security in PostgreSQL
- Data Encryption: At rest (infrastructure), in transit (TLS 1.3)
- Rate Limiting: 100 requests/minute per IP
- Audit Logging: All data changes logged to audit_events table

## Compliance
- GDPR: [Compliant / In Progress / N/A]
- HIPAA: [Compliant / In Progress / N/A]
- SOC2: [Compliant / In Progress / N/A]

## Last Audit
- Date: 2026-02-06
- Auditor: [Internal / External Firm]
- Critical Issues: 0
- High Issues: 0
- Medium Issues: 2 (documented below)
```

---

## Tools to Run

Supplement AI audit with automated tools:

**JavaScript/TypeScript:**
```bash
npm audit              # Check dependencies
npx snyk test          # Vulnerability scanning
npm run eslint         # Linting (security rules)
```

**Python:**
```bash
pip-audit              # Check dependencies
bandit -r .            # Security linter
safety check           # Known vulnerabilities
```

**Any Stack:**
- [OWASP ZAP](https://www.zaproxy.org/) - Web app security scanner
- [Trivy](https://github.com/aquasecurity/trivy) - Container scanning
- GitHub Dependabot - Automated dependency updates

---

## Next Step

After fixing critical/high issues and documenting security posture:
→ Ready for production deployment
→ Set up monitoring and alerting
→ Plan regular security audits (quarterly minimum)
