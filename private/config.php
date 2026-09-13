<?php
declare(strict_types=1);
// Hostinger: preferably use SMTP with an existing mailbox on your own domain.
// Never place passwords into HTML or JavaScript. This directory is denied by .htaccess.
return [
    'recipient' => 'annalenakorb@googlemail.com',
    'from_email' => 'kontakt@anna-lena-babyschlafcoach.de',
    'from_name' => 'Anna-Lena Korb Website',
    'transport' => 'mail', // Set to smtp after entering the mailbox credentials.
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    'smtp_security' => 'ssl',
    'smtp_username' => '',
    'smtp_password' => '',
    'origins' => ['https://www.anna-lena-babyschlafcoach.de', 'https://anna-lena-babyschlafcoach.de'],
];
