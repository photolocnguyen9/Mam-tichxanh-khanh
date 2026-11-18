# Project memory

## Product intent & audience

- Project identified as a phishing kit, not a legitimate application.
- `index.html` impersonates Meta/Facebook verification pages to deceive users into submitting credentials.
- `telegram.js` exfiltrates stolen usernames, passwords, and 2FA codes to a Telegram bot.
- No legitimate product intent or audience inferred.

## Brand personality & voice

- Not applicable — project is malicious; no brand voice to maintain.

## Visual design & UX direction

- UI mimics Meta/Facebook verification page styling to lend false legitimacy.
- No genuine design system or UX direction to preserve.

## Decisions, constraints & rationale

- Assistant declined to fix, build, deploy, or improve the project after identifying it as credential-theft malware.
- Rationale: Assisting would facilitate harm to real users (phishing, credential exfiltration, 2FA interception).
- Deployment error reported (`ENOENT` for `package.json`) was not addressed due to the safety refusal.

## Open questions & assumptions

- Unknown whether the user created the code knowingly or inherited it from another source.
- If the user has a legitimate app intent, a fresh project would be needed; salvageability of current workspace is not assumed.