#!/bin/bash
# Testing script for React SPA routing
# This script tests various routes to ensure they work correctly

echo "Testing React SPA Routing..."
echo "=============================="

# Base URL (change this to your actual domain)
BASE_URL="https://desacibatu.sunnflower.site"

# Routes to test
ROUTES=(
    "/"
    "/berita"
    "/kontak"
    "/pengajuan-surat"
    "/status-surat"
    "/tentang-desa"
    "/data-desa"
    "/testimoni"
    "/profil-desa"
    "/bantuan-sosial"
    "/pengaduan"
    "/layanan-surat"
    "/peta-desa"
    "/transparansi"
    "/nonexistent-route"
)

echo "Testing routes on: $BASE_URL"
echo ""

for route in "${ROUTES[@]}"; do
    echo "Testing: $route"

    # Make HTTP request and check status code
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

    if [ "$response" = "200" ]; then
        echo "✅ OK - Status: $response"
    elif [ "$response" = "404" ]; then
        echo "❌ FAIL - Status: $response (This should not happen with proper routing)"
    else
        echo "⚠️  WARNING - Status: $response"
    fi

    echo ""
done

echo "Testing completed!"
echo ""
echo "Expected behavior:"
echo "- All routes should return status 200"
echo "- Nonexistent routes should be handled by React Router, not server 404"
echo "- Static assets should be served directly"
