# zerhacken
Splittet Sammelbänder bei ungewöhnlich langer Stille (Web-Frontend und Mini-API zu [stille_splitten](https://github.com/hogshead-revival-widow/stille_splitten))

# Installation

1. stille_splitten installieren (vgl. [hier](https://github.com/hogshead-revival-widow/stille_splitten))
2. Dieses Reposity hier klonen oder runterladen
3. cd `<Verzeichnis in das entpackt wurde>`
4. python -m pip install -e .
5. `DIR_BASE` in `src/settings.py` z. B. auf `<Verzeichnis in das entpackt wurde>` anpassen
6. python
7. In die nun geöffnete interaktive Python-Instanz eingeben:
    `from src.models import db
    db.create_all()`

Mit `python main.py` startet das Programm nun.

# Verweise

Der Code in `js/dropzone/*` und `css/dropzone*` ist Fremdcode.
Bitte [hier](https://github.com/dropzone/dropzone) für näheres (z. B.  Lizenz) nachsehen.
