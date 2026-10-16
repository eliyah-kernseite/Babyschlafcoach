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
Bei Änderungen aus Pages CMS übernimmt das der Workflow automatisch (siehe unten).

## Inhalte bearbeiten mit Pages CMS

Texte, Preise, Kontaktdaten und Fotos stehen in `content/` (YAML) und werden in
[Pages CMS](https://app.pagescms.org) bearbeitet. Welche Felder dort erscheinen,
legt `.pages.yml` fest. Jedes Speichern ist ein Commit auf main. Der Workflow
„Branch live aktualisieren“ baut danach die Seiten, schreibt die erzeugten
HTML-Dateien und Bildversionen nach main zurück und veröffentlicht auf `live`.

- Fließtexte nutzen ein kleines Textformat (src/text.mjs): Leerzeile = neuer Absatz,
  `## Überschrift`, `### Überschrift`, `- Punkt`, `✓ Punkt`, `✗ Punkt`, `**fett**`,
  `[Linktext](seite.html)`, `{.lead}` am Absatzanfang für eine CSS-Klasse und
  Platzhalter wie `{{email}}` oder `{{telefon}}`.
- Fotos werden in Pages CMS nach `assets/bilder/` hochgeladen. `npm run build`
  erzeugt daraus `assets/name-640/768/960/1440.webp` (scripts/images.mjs, sharp).
  Bildbeschreibung und Bildnachweis stehen in `content/fotos.yml`.
- Wer ein Feld im Code ergänzt, muss es auch in `.pages.yml` eintragen. Pages CMS
  schreibt beim Speichern nur Felder zurück, die dort beschrieben sind.
- Fest im Code bleiben Layout, Navigation, Formularbeschriftungen, Termin-Logik
  (Zeiten in src/content.mjs) und strukturierte Daten.
Die bestehenden GitHub-Pages-Einstellungen bleiben unverändert:
main, Repository-Wurzel. Änderungen auf einem anderen Branch sind noch nicht live.

## Dateien

| Pfad | Aufgabe |
| --- | --- |
| content/ | Alle Texte, Preise, Kontaktdaten, Fotoliste (bearbeitet in Pages CMS) |
| .pages.yml | Felder und Bezeichnungen in Pages CMS |
| src/content.mjs | Liest content/, feste technische Werte, Bildmaße |
| src/text.mjs | Textformat der Inhaltsdateien |
| src/pages.mjs | Markup für Startseite, Online-Beratung, Person, Ablauf, Preise, Kontakt, Ratgeber (Einschlafen, Durchschlafen, Schlafwissen), 404 |
| src/layout.mjs | Navigation, Footer, Metadaten, strukturierte Daten (FAQ, Breadcrumb, Service, Artikel), Fotoliste, Porträt-Karte |
| src/legal.mjs | Impressum, Datenschutz, AGB, Widerruf, Zugänglichkeit, Bildnachweise |
| assets/config.js | Wird beim Bauen aus content/einstellungen.yml erzeugt (E-Mail, Telefon, Preise für das Terminformular) |
| assets/booking.js | Reine Kalenderlogik, Datum, Dauer, Ersatz-Entwurf |
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
4. Kontaktdaten ergänzen und **Anfrage senden**. Der Browser schickt die Anfrage an
   Web3Forms (api.web3forms.com), das sie per E-Mail an Anna-Lenas Gmail-Adresse
   weiterleitet. Der Zugangsschlüssel steht als `formKey` in src/content.mjs; er ist
   öffentlich gedacht und erlaubt nur den Versand an die bei Web3Forms bestätigte Adresse.
   In Web3Forms die Aufbewahrung auf 7 Tage stellen (so steht es im Datenschutz).
5. Ist kein `formKey` gesetzt oder klappt der Versand nicht, zeigt die Seite den
   E-Mail-Entwurf: im Mailprogramm oder Gmail öffnen oder Text kopieren.

Das ist eine **Terminanfrage**, kein angebundener Echtzeitkalender: kein
Verfügbarkeitsabgleich, keine Reservierung, keine Bezahlung.
Ohne JavaScript bleiben E-Mail, Telefon und alle Informationsseiten nutzbar.
Niemals Zugangsdaten in assets/config.js oder andere öffentliche Dateien setzen.

## Fotos und Zertifikat

Die Originale liegen in assets/bilder/, die Webseite nutzt die daraus erzeugten
Versionen assets/name-640/768/960/1440.webp. Bildbeschreibung, Fotograf und Quelle
stehen in content/fotos.yml; die Seite Bildnachweise wird daraus erzeugt.
Neues Foto: in Pages CMS hochladen, in content/fotos.yml beschreiben und im
gewünschten Bildfeld auswählen. Nur Fotos mit
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

Bei einem späteren Domainwechsel site.url in src/content.mjs ändern und neu
bauen. Danach Canonical, Sitemap, strukturierte Daten und 404-Seite kontrollieren.
Der Review-Branch ist nicht automatisch eine zweite Live-Website.

Hosting: Hostinger, Domain-Root (public_html), per GIT-Deployment aus dem Branch
`live`. Jeder Push auf `main` startet `.github/workflows/publish-live.yml`: Der
Workflow baut und testet die Seite und legt nur die Dateien, die online gehen
sollen, auf `live` (ohne Quellcode, Tests und Arbeitsdateien). `live` nie direkt
bearbeiten. GitHub Pages danach abschalten, damit es keine zweite Kopie der
Seite gibt.

## Offene Freigaben

Porträt und Montessori-/Kinderyoga-Nachweise ergänzen. Inhaltliche und
rechtliche Abschlussprüfung vor dem geschäftlichen Livegang, einschließlich der
tatsächlichen Kommunikationsdienste. Die Rechtstexte sind keine anwaltliche Prüfung.
Siehe docs/QUELLEN_UND_FREIGABE.md für den vollständigen Stand.
