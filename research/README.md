AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

# Research Tracking

This directory stores machine-readable research findings and implementation tasks extracted from documentation across the repo.

Artifacts:
- findings.json: normalized research findings and action items
- tasks.json: prioritized tasks generated from findings

Sources scanned by the ingestion script:
- docs/**, codex/**, genome/**, services/** READMEs
- Manifest files like FUTURE_INNOVATIONS_MANIFESTO.md, AZORA_UPGRADE_SUMMARY.md

Run:
- npm run research:ingest
- npm run research:status


