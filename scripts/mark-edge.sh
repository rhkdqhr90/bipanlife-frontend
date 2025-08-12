set -euo pipefail
FILES=$(git ls-files 'src/app/**/page.tsx' 'src/app/**/route.ts')
echo "$FILES" | while IFS= read -r f; do
  [[ -f "$f" ]] || continue

  # 이미 선언되어 있으면 스킵
  if grep -q "export const runtime *= *'edge'" "$f"; then
    continue
  fi

  # 'use client'가 맨 위면 맨 아래에 추가, 아니면 맨 위에 추가
  if head -n1 "$f" | grep -qE "^(\"use client\"|'use client');"; then
    printf "\nexport const runtime = 'edge';\n" >> "$f"
  else
    tmp="${f}.tmp"
    { printf "export const runtime = 'edge';\n"; cat "$f"; } > "$tmp" && mv "$tmp" "$f"
  fi
done
