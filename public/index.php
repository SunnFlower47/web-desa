<?php
/**
 * Fallback index.php for React SPA routing
 * This file ensures that all routes are handled by the React application
 * even if .htaccess is not working properly
 */

// Get the requested URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Remove query string for path checking
$pathWithoutQuery = strtok($requestPath, '?');

// List of static files that should be served directly
$staticFiles = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.json',
    '.xml', '.txt', '.geojson'
];

// Check if the request is for a static file
$isStaticFile = false;
foreach ($staticFiles as $extension) {
    if (strpos($pathWithoutQuery, $extension) !== false) {
        $isStaticFile = true;
        break;
    }
}

// If it's a static file request, let Apache handle it
if ($isStaticFile) {
    return false;
}

// For all other requests, serve the React app
$indexPath = __DIR__ . '/index.html';

if (file_exists($indexPath)) {
    // Set proper headers
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');

    // Read and output the index.html file
    readfile($indexPath);
} else {
    // Fallback if index.html doesn't exist
    http_response_code(404);
    echo '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Halaman Tidak Ditemukan</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #e74c3c; }
        p { color: #666; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>404 - Halaman Tidak Ditemukan</h1>
    <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
    <a href="/">Kembali ke Beranda</a>
</body>
</html>';
}
?>
