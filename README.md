# Anna-Lena Korb · Babyschlafcoach

Statische Website (HTML, CSS, JavaScript) für die Schlafberatung von Anna-Lena Korb.
Die Dateien liegen direkt im Hauptverzeichnis, damit GitHub Pages sie ausliefern kann.

## Vorschau auf GitHub Pages

https://eliyahkorb-blip.github.io/Babyschlafcoach/

Veröffentlichung: **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**

## Hinweis zum Kontaktformular

GitHub Pages führt kein PHP aus. Das Kontaktformular dient in der Vorschau deshalb
nur der Ansicht: Auf `*.github.io` wird keine Anfrage an `api/contact.php` gesendet.
Nach dem Absenden erscheint stattdessen ein Hinweis mit der E-Mail-Adresse
annalenakorb@googlemail.com.

Auf der veröffentlichten Hostinger-Website funktioniert der PHP-Versand unverändert.

## Aufbau

| Pfad            | Inhalt                                                      |
| --------------- | ----------------------------------------------------------- |
| `index.html`    | Startseite, dazu alle weiteren Unterseiten im Hauptverzeichnis |
| `assets/`       | CSS, JavaScript, Bilder, Logo, lokale Schrift (Manrope)      |
| `api/`          | PHP-Endpunkt des Kontaktformulars (nur Hostinger)            |
| `private/`      | Konfiguration des Formulars (nur Hostinger)                  |
| `vendor/`       | PHPMailer (nur Hostinger)                                    |
| `.htaccess`     | Apache-Konfiguration für Hostinger, von GitHub Pages ignoriert |
| `.nojekyll`     | schaltet die Jekyll-Verarbeitung auf GitHub Pages ab          |

Alle Pfade in HTML, CSS und JavaScript sind relativ, damit die Seite sowohl unter
`https://eliyahkorb-blip.github.io/Babyschlafcoach/` als auch unter der eigenen
Domain funktioniert.

## Upload zu Hostinger

Den gesamten Inhalt des Hauptverzeichnisses nach `public_html/` hochladen
(`.htaccess` einschließen). `.nojekyll` und `README.md` werden dort nicht benötigt.
In `private/config.php` gehören die echten Zugangsdaten des Postfachs – diese Datei
sollte mit echten Zugangsdaten **nicht** in ein öffentliches Repository eingecheckt werden.
