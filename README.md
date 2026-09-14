# Babyschlafberatung Anna-Lena Korb

Statische Website für GitHub Pages. Die HTML-Dateien im Hauptverzeichnis werden
aus gemeinsamen Vorlagen erzeugt; auf dem Webserver wird kein Node und kein PHP benötigt.

## Entwicklung und Prüfung

Node.js 24.15 oder neuer innerhalb der 24er-Version (alternativ 22.22.2+):

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run serve
```

Vorschau: http://localhost:4173/Babyschlafcoach/
Auch http://localhost:4173/ funktioniert. Den Server mit Strg+C beenden.

Nach Inhaltsänderungen immer neu bauen und die erzeugten HTML-Dateien mit committen.
Die bestehenden GitHub-Pages-Einstellungen bleiben unverändert:
main, Repository-Wurzel. Änderungen auf einem anderen Branch sind noch nicht live.

## Dateien

| Pfad | Aufgabe |
| --- | --- |
| src/pages.mjs | Startseite, Person, Ablauf, Preise, Kontakt, Schlafwissen, 404 |
| src/layout.mjs | Navigation, Footer, Metadaten, strukturierte Daten, Porträtplatzhalter |
| src/legal.mjs | Impressum, Datenschutz, AGB, Widerruf, Zugänglichkeit, Bildnachweise |
| assets/config.js | Öffentliche E-Mail, Telefonnummer, Basis-URL, Zeiten, Preise |
| assets/booking.js | Reine Kalenderlogik, Datum, Dauer, Anfragevorbereitung |
| assets/site.js | Menü und interaktive Terminanfrage |
| assets/site.css | Responsive Gestaltung, Fokus, reduzierte Bewegung |
| scripts/build.mjs | Reproduzierbarer Bau der 13 HTML-Seiten, Sitemap, robots.txt |
| scripts/serve.mjs | Lokale Vorschau ohne zusätzliche Abhängigkeiten |
| tests/ | Automatisierte Logik- und Strukturprüfungen |
| docs/QUELLEN_UND_FREIGABE.md | Herkunft, Entscheidungen, bekannte Grenzen, Freigabepunkte |

## So funktioniert die Terminanfrage

1. Angebot wählen: Kennenlernen 20 Min., Sprechstunde 45 Min., Paketstart 60 Min.
2. Ein bis drei Wunschzeiten wählen: Mo–Fr 17–19 Uhr, Sa 9–13 Uhr, Sonntag geschlossen.
3. Mindestens sieben lokale Kalendertage Vorlauf; am ersten Tag frühestens zur
   aktuellen deutschen Uhrzeit. Anfragen bis 90 Tage voraus. Zeitzone Europe/Berlin.
4. Kontaktdaten ergänzen und **Anfrage als E-Mail vorbereiten**.
5. Entwurf im eigenen Mailprogramm oder Gmail öffnen und **dort selbst absenden**.
   Alternativ Text kopieren. Anna-Lena bestätigt anschließend einen Termin.

Das ist eine funktionierende **Terminanfrage**, kein angebundener Echtzeitkalender.
Es gibt keinen Verfügbarkeitsabgleich, keine automatischen Bestätigungen,
keine Reservierung, keine Bezahlung und keine automatische E-Mail-Zustellung.
Ohne JavaScript bleiben E-Mail, Telefon und alle Informationsseiten nutzbar.
Der Kalender benötigt kein zusätzliches Konto und lädt keine externen Dienste.
Die Gmail-Schaltfläche überträgt den Entwurf erst beim Anklicken an Google.

Wenn später echte Direktbuchung gewünscht ist, einen geeigneten Dienst oder
Backend ergänzen und Datenschutz, Verfügbarkeitslogik und End-to-End-Test anpassen.
Niemals Zugangsdaten in assets/config.js oder andere öffentliche Dateien setzen.

## Fotos und Zertifikat

Das bestehende lokale Unsplash-Motiv mit Babyhand bleibt als Symbolbild.
Anna-Lenas Porträt ist bewusst als Platzhalter gekennzeichnet. Zum Ersetzen
in src/layout.mjs die Funktion portrait() anpassen und ein freigegebenes,
optimiertes Foto mit Größenangaben und passendem Alternativtext hinterlegen.
Keine Stockperson als Anna-Lena ausgeben. Vorhandene Kinderfotos nicht ungeprüft
von der Kindertagespflege übernehmen.

Das bereitgestellte Originalzertifikat liegt unter
assets/zertifikat-anna-lena-korb.pdf; die PNG-Datei ist lediglich dessen Vorschau.

## Veröffentlichung

Die kanonische Basis-URL ist aktuell:
https://eliyahkorb-blip.github.io/Babyschlafcoach/

Bei einem späteren Domainwechsel site.url in assets/config.js ändern und neu
bauen. Danach Canonical, Sitemap, strukturierte Daten und 404-Seite kontrollieren.
Der Review-Branch ist nicht automatisch eine zweite Live-Website.

## Bestehende PHP-Dateien

api/, private/, vendor/ und .htaccess stammen aus der alten Hostinger-Fassung.
Sie wurden nicht gelöscht, werden von der neuen Oberfläche aber nicht verwendet.
GitHub Pages führt PHP nicht aus und beachtet keine .htaccess-Schutzregeln.
**Keine echten Zugangsdaten ins öffentliche Repository eintragen.**
Bei einem späteren Hostinger-Umzug die vorhandene Backend-Konfiguration gesondert
prüfen; der aktuelle Website-Code benutzt auch dort die E-Mail-Entwurfsfunktion.

## Offene Freigaben

Porträt und Montessori-/Kinderyoga-Nachweise ergänzen. Inhaltliche und
rechtliche Abschlussprüfung vor dem geschäftlichen Livegang, einschließlich der
tatsächlichen Kommunikationsdienste. Die Rechtstexte sind keine anwaltliche Prüfung.
Siehe docs/QUELLEN_UND_FREIGABE.md für den vollständigen Stand.
