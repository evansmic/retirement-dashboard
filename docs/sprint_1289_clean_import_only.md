Sprint S1289 made production import clean-schema only.

The production validator accepts wrapped clean schema files and blocks current editable v2 files with the earlier-version message. Raw unwrapped payloads remain blocked.

There is no migration path for retired tester files.
