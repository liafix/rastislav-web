1. VERIFIED: focused server tests cover required inquiry fields and malformed direct requests.
2. VERIFIED: mock persistence tests cover duplicate submission and save-before-email ordering.
3. VERIFIED: company and customer templates include all fields, HTML escaping and next steps.
4. VERIFIED: mocked SMTP tests cover headers, recipients, exact credentials and failure handling.
5. VERIFIED: admin/origin tests and local HTTP checks reject wrong passwords, forged cookies and cross-origin mutation.
6. VERIFIED: all 63 tests, TypeScript, corrected lint, production build and local migration check pass.
7. VERIFIED: Edge checks at 320, 375, 390, 768 and 1440 px show no overflow, including admin with mocked data.
8. PENDING: production DB migration and real completed-state persistence; mock completion survives refresh.
9. PENDING: public HTTPS deployment and real receipt of both emails by Martin.
10. FOR A REAL CLIENT: add agreed monitoring, backups, retention, delivery recovery and platform abuse limits.
