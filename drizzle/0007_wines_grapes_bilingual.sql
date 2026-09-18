-- Converts wines.grapes from a JSON array of grape names to bilingual JSON
-- ({"en": "Saperavi, Rkatsiteli", "ka": ""}), matching name/style/description.
-- The admin form already edited grapes as one comma-separated text field, so
-- this just joins the existing array with ", " into the English side.
UPDATE `wines`
SET `grapes` = json_object(
  'en', (
    SELECT group_concat(value, ', ')
    FROM json_each(`grapes`)
  ),
  'ka', ''
)
WHERE `grapes` IS NOT NULL;
