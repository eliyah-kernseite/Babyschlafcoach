<?php
declare(strict_types=1);
// Konfiguration fuer api/contact.php. Dieses Verzeichnis ist per .htaccess gesperrt.
// Keine Passwoerter eintragen: die Datei liegt im Git-Repository.
// Absender muss ein bei Hostinger angelegtes Postfach dieser Domain sein (hPanel > E-Mails).
return [
    'recipient' => 'babyschlafcoach.annalena@gmail.com',
    'from_email' => 'kontakt@babyschlaf-coach.de',
    'from_name' => 'Website babyschlaf-coach.de',
    'transport' => 'mail',
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    'smtp_security' => 'ssl',
    'smtp_username' => '',
    'smtp_password' => '',
    'origins' => ['https://babyschlaf-coach.de', 'https://www.babyschlaf-coach.de'],
];
