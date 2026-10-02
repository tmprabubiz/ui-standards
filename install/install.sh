#!/usr/bin/env bash
# Install the ui-standards skill into an app folder, or globally for your user.
#   ./install/install.sh /path/to/my-app
#   ./install/install.sh /path/to/my-app claude,codex,copilot,cursor
#   ./install/install.sh --global
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="$REPO/skill/ui-standards"
ADAPTERS="$REPO/adapters"
START='<!-- ui-standards:start -->'
END='<!-- ui-standards:end -->'

copy_skill() {
  mkdir -p "$1"
  cp -R "$SKILL/." "$1/"
  echo "  skill  -> $1"
}

seed_templates() {
  local target_dir="$1/docs/ui-standards"
  mkdir -p "$target_dir"
  for name in COVERAGE.md NEXT-ITERATION.md SLICE-WALKTHROUGH.md; do
    if [ ! -e "$target_dir/$name" ]; then
      cp "$SKILL/references/templates/$name" "$target_dir/$name"
    fi
  done
  echo "  templates -> $target_dir"
}

set_block() {
  local file="$1" snippet="$ADAPTERS/$2"
  mkdir -p "$(dirname "$file")"
  if [ -f "$file" ] && grep -qF "$START" "$file"; then
    local s e
    s=$(grep -nF "$START" "$file" | head -n1 | cut -d: -f1)
    e=$(grep -nF "$END" "$file" | head -n1 | cut -d: -f1)
    if [ -z "$e" ] || [ "$e" -lt "$s" ]; then
      echo "Broken ui-standards markers in $file; fix or remove them and re-run." >&2
      exit 1
    fi
    awk -v s="$START" -v e="$END" -v f="$snippet" '
      $0 == s { while ((getline line < f) > 0) print line; skip = 1; next }
      $0 == e { skip = 0; next }
      !skip { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  elif [ -f "$file" ]; then
    printf '\n' >> "$file"
    cat "$snippet" >> "$file"
  else
    cat "$snippet" > "$file"
  fi
  echo "  block  -> $file"
}

if [ "${1:-}" = "--global" ]; then
  echo "Installing ui-standards for your user account"
  copy_skill "$HOME/.claude/skills/ui-standards"
  copy_skill "$HOME/.agents/skills/ui-standards"
  echo "Done. Restart your agent to pick up the skill."
  exit 0
fi

TARGET="${1:?Give a target app folder or --global}"
TOOLS="${2:-claude,codex}"
[ -d "$TARGET" ] || { echo "Folder not found: $TARGET" >&2; exit 1; }
TARGET="$(cd "$TARGET" && pwd)"
echo "Installing ui-standards into $TARGET ($TOOLS)"

copy_skill "$TARGET/.agents/skills/ui-standards"
seed_templates "$TARGET"
set_block "$TARGET/AGENTS.md" AGENTS.snippet.md

case ",$TOOLS," in *,claude,*)
  copy_skill "$TARGET/.claude/skills/ui-standards"
  set_block "$TARGET/CLAUDE.md" CLAUDE.snippet.md ;;
esac
case ",$TOOLS," in *,copilot,*)
  set_block "$TARGET/.github/copilot-instructions.md" copilot-instructions.snippet.md ;;
esac
case ",$TOOLS," in *,cursor,*)
  mkdir -p "$TARGET/.cursor/rules"
  cp "$ADAPTERS/cursor-rule.mdc" "$TARGET/.cursor/rules/ui-standards.mdc"
  echo "  rule   -> $TARGET/.cursor/rules/ui-standards.mdc" ;;
esac

echo 'Done. Ask your agent: "Use ui-standards to plan this app" or "What is this app missing?"'
