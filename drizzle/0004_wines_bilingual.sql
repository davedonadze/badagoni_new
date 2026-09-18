-- Converts wines.name/style/description from plain text to bilingual JSON
-- ({"en": "...", "ka": ""}), matching the Localized pattern used by
-- menu_items. No column type change needed (SQLite stores JSON as TEXT);
-- this only rewrites the stored values. Georgian sides start empty and are
-- filled in via the admin panel's "Translate from English" button.
UPDATE `wines` SET `name` = json_object('en', `name`, 'ka', '');
UPDATE `wines` SET `style` = CASE WHEN `style` IS NULL THEN NULL ELSE json_object('en', `style`, 'ka', '') END;
UPDATE `wines` SET `description` = CASE WHEN `description` IS NULL THEN NULL ELSE json_object('en', `description`, 'ka', '') END;
