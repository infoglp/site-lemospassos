<?php
// Copy this file to config.php and fill credentials in Hostinger File Manager.
return [
    'db_host' => '127.0.0.1',
    'db_name' => 'YOUR_HOSTINGER_DATABASE_NAME',
    'db_user' => 'YOUR_HOSTINGER_DATABASE_USER',
    'db_password' => 'SET_THIS_IN_HOSTINGER_ONLY',
    'admin_user' => 'admin',
    // Generate with: php -r "echo password_hash('YOUR_NEW_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
    'admin_password_hash' => 'REPLACE_WITH_PASSWORD_HASH',
];
