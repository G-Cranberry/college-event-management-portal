# Campusly — Wallet Scroll Isolation FINAL

This version fixes wallet gesture isolation:
- wheel inside the wallet changes passes without scrolling the page
- touch swipe inside the wallet changes passes without scrolling the page
- page scrolling remains normal outside the wallet
- desktop Arrow Up/Down still browses passes
- existing wallet/pass/QR functionality is preserved

Implementation uses simple HTML, CSS and Vanilla JavaScript.


## Added Demo Modules

- Gallery with local image upload, download, and social-share demo actions.
- Event streak and level badge: Bronze Explorer, Silver Explorer, Gold Explorer, Campus Legend.
- Wallet QR preview on each generated pass.
- Organizer scanner demo that matches pass IDs to the same local Campusly ID.
- Local-only attendance updates with no backend requirement.
