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
| src/pages.mjs | Startseite, Online-Beratung, Person, Ablauf, Preise, Kontakt, Ratgeber (Einschlafen, Durchschlafen, Schlafwissen), 404 |
| src/layout.mjs | Navigation, Footer, Metadaten, strukturierte Daten (FAQ, Breadcrumb, Service, Artikel), Fotoliste, Porträt-Karte |
| src/legal.mjs | Impressum, Datenschutz, AGB, Widerruf, Zugänglichkeit, Bildnachweise |
| assets/config.js | Öffentliche E-Mail, Telefonnummer, Basis-URL, Zeiten, Preise |
| assets/booking.js | Reine Kalenderlogik, Datum, Dauer, Anfragevorbereitung |
| assets/site.js | Menü, Scroll-Animationen, Inhaltsverzeichnis, interaktive Terminanfrage |
| assets/site.css | Gestaltung (Newsreader + Manrope), responsiv, Motion, reduzierte Bewegung |
| scripts/build.mjs | Reproduzierbarer Bau der 16 HTML-Seiten, Sitemap, robots.txt |
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

Alle Fotos stammen von Unsplash (Unsplash-Lizenz) und liegen lokal in assets/
als name-640/960/1440.webp. Welche Fotos verwendet werden, steht in der Liste
`photos` in src/layout.mjs; die Seite Bildnachweise wird daraus erzeugt.
Neues Foto: Dateien ablegen, Eintrag mit Fotograf, Unsplash-Link und
Alternativtext ergänzen, mit `photo('name')` einbinden, neu bauen. Nur Fotos mit
kostenloser Unsplash-Lizenz verwenden (kein Unsplash+), und bei schlafenden Babys
auf sichere Schlafsituationen achten (Rückenlage, keine Kissen oder Decken).

Anna-Lenas Porträt wird derzeit durch eine Zitatkarte mit Logo ersetzt
(Funktion portrait() in src/layout.mjs). Ein echtes, freigegebenes Porträt ist der
stärkste Vertrauensfaktor und sollte dort eingesetzt werden.
Keine Stockperson als Anna-Lena ausgeben. Vorhandene Kinderfotos nicht ungeprüft
von der Kindertagespflege übernehmen.

Das bereitgestellte Originalzertifikat liegt unter
assets/zertifikat-anna-lena-korb.pdf; die PNG-Datei ist lediglich dessen Vorschau.
assets/social.jpg ist das Vorschaubild für geteilte Links (1200×630).

## SEO

Ausrichtung: Babyschlafberatung online für ganz Deutschland, regional Würzburg.
Jede Seite hat eigenen Titel, Beschreibung, Canonical und strukturierte Daten
(ProfessionalService, Person, Breadcrumb, je nach Seite FAQ, Service mit Preisen
oder Artikel). Die Ratgeberseiten Baby einschlafen und Baby schläft nicht durch
zielen auf häufige Suchanfragen. Das Datum `updated` in src/layout.mjs bei
inhaltlichen Änderungen anpassen; es landet in Sitemap und Artikeldaten.
Nach dem Livegang die Sitemap in der Google Search Console einreichen.

## Veröffentlichung

Die kanonische Basis-URL ist aktuell:
https://babyschlaf-coach.de/

Bei einem späteren Domainwechsel site.url in assets/config.js ändern und neu
bauen. Danach Canonical, Sitemap, strukturierte Daten und 404-Seite kontrollieren.
Der Review-Branch ist nicht automatisch eine zweite Live-Website.

Hosting: Hostinger, Domain-Root (public_html). Am einfachsten per GIT-Deployment
aus dem Branch `main` nach public_html; die gebauten HTML-Dateien liegen im
Repository-Root, ein Build auf dem Server ist nicht nötig. Die .htaccess sperrt
Quellcode, Tests und Arbeitsdateien. GitHub Pages danach abschalten, damit es
keine zweite Kopie der Seite gibt.

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
