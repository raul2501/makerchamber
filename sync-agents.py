#!/usr/bin/env python3
"""
sync-agents.py
Converts .claude/agents/*.md → .codex/agents/*.toml
Run this after editing any agent in .claude/agents/.

Usage: python3 sync-agents.py
"""

import os
import re

SRC = os.path.join(os.path.dirname(__file__), ".claude", "agents")
DST = os.path.join(os.path.dirname(__file__), ".codex", "agents")

def parse_md(text):
    """Extract frontmatter fields and body from an agent .md file."""
    m = re.match(r"^---\n(.*?)\n---\n(.*)", text, re.DOTALL)
    if not m:
        return None, None, None
    frontmatter, body = m.group(1), m.group(2).strip()

    name = re.search(r'^name:\s*(.+)$', frontmatter, re.MULTILINE)
    description = re.search(r'^description:\s*["\']?(.*?)["\']?\s*$', frontmatter, re.MULTILINE)

    return (
        name.group(1).strip() if name else "",
        description.group(1).strip() if description else "",
        body,
    )

def to_toml(name, description, body):
    escaped = body.replace('"""', '\\"\\"\\"')
    return f'''name = "{name}"
description = "{description}"
developer_instructions = """
{escaped}"""
'''

os.makedirs(DST, exist_ok=True)

updated, skipped = 0, 0
for filename in os.listdir(SRC):
    if not filename.endswith(".md"):
        continue

    with open(os.path.join(SRC, filename)) as f:
        text = f.read()

    name, description, body = parse_md(text)
    if not name:
        print(f"  SKIP {filename} (no frontmatter)")
        skipped += 1
        continue

    toml_name = filename.replace(".md", ".toml")
    toml_path = os.path.join(DST, toml_name)
    toml_content = to_toml(name, description, body)

    with open(toml_path, "w") as f:
        f.write(toml_content)

    print(f"  OK   {filename} → {toml_name}")
    updated += 1

print(f"\nDone. {updated} synced, {skipped} skipped.")
