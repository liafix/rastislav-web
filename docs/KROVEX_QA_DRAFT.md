1. VERIFIED: focused server tests cover required inquiry fields and malformed direct requests.
2. VERIFIED: mock persistence tests cover duplicate submission and save-before-email ordering.
3. VERIFIED: company and customer templates include all fields, HTML escaping and next steps.
4. VERIFIED: mocked SMTP tests cover headers, recipients, exact credentials and failure handling.
5. VERIFIED: auth tests reject wrong passwords, forged/expired cookies and unauthorized mutation.
6. PENDING: final build, TypeScript and corrected lint evidence will be recorded after the final gate.
7. PENDING: browser checks at 320, 375, 390, 768 and 1440 px, including admin.
8. PENDING: verified production DB migration and completed-state persistence after refresh.
9. PENDING: public HTTPS deployment and real receipt of both emails by Martin.
10. FOR A REAL CLIENT: add agreed monitoring, backups, retention, delivery recovery and platform abuse limits.
