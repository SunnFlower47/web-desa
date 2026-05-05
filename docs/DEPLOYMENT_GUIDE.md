# Production deployment configuration for React SPA
# Copy these files to your hosting directory after building

# 1. Build the React application
npm run build

# 2. Upload the entire 'build' folder contents to your hosting root directory
# 3. Make sure .htaccess and index.php are in the root directory
# 4. Set proper file permissions (644 for files, 755 for directories)

# File structure on hosting should be:
# /
# ├── .htaccess
# ├── index.html
# ├── index.php
# ├── static/
# │   ├── css/
# │   └── js/
# ├── logo desa cibatu.png
# ├── favicon.ico
# └── other static assets...

# Important notes:
# - The .htaccess file handles URL rewriting for client-side routing
# - The index.php file serves as a fallback if .htaccess doesn't work
# - All routes will be handled by React Router after these files are in place
# - Static assets (CSS, JS, images) will be served directly by Apache

