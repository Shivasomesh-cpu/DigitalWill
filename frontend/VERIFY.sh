#!/bin/bash
# DigitalWill Frontend - Quick Verification Script

echo "🔍 DigitalWill Frontend Verification"
echo "===================================="
echo ""

# Check if node_modules exists
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ Dependencies installed"
else
    echo "  ⚠️  Dependencies not installed. Run: npm install"
fi

# Check key files
echo ""
echo "✓ Checking critical files..."

files=(
    "package.json"
    "tsconfig.json"
    "tailwind.config.ts"
    "globals.css"
    ".env.local"
    "app/layout.tsx"
    "app/providers.tsx"
    "app/(auth)/login/page.tsx"
    "app/(dashboard)/page.tsx"
    "app/(dashboard)/scan/page.tsx"
    "app/(dashboard)/accounts/page.tsx"
    "app/(dashboard)/will/page.tsx"
    "app/(dashboard)/deadman/page.tsx"
)

missing=0
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        missing=$((missing + 1))
    fi
done

# Check hooks
echo ""
echo "✓ Checking hooks..."
hooks=(
    "hooks/useAccounts.ts"
    "hooks/useScan.ts"
    "hooks/useWill.ts"
    "hooks/useDeadman.ts"
)

for hook in "${hooks[@]}"; do
    if [ -f "$hook" ]; then
        echo "  ✅ $hook"
    else
        echo "  ❌ $hook (MISSING)"
        missing=$((missing + 1))
    fi
done

# Check UI components
echo ""
echo "✓ Checking UI components..."
ui_components=(
    "components/ui/button.tsx"
    "components/ui/input.tsx"
    "components/ui/textarea.tsx"
    "components/ui/separator.tsx"
    "components/ui/checkbox.tsx"
    "components/ui/select.tsx"
    "components/ui/table.tsx"
    "components/ui/switch.tsx"
    "components/ui/dialog.tsx"
    "components/ui/dropdown-menu.tsx"
    "components/ui/alert-dialog.tsx"
)

for component in "${ui_components[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✅ $(basename $component)"
    else
        echo "  ❌ $(basename $component) (MISSING)"
        missing=$((missing + 1))
    fi
done

# Summary
echo ""
echo "===================================="
if [ $missing -eq 0 ]; then
    echo "✅ ALL FILES PRESENT - READY TO RUN"
    echo ""
    echo "Next steps:"
    echo "1. npm install"
    echo "2. npm run dev"
    echo "3. Open http://localhost:3000"
else
    echo "❌ $missing file(s) missing"
fi
