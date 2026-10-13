UPDATE `pages`
SET `content` = json_set(
  json_remove(`content`, '$.figure', '$.qvevri'),
  '$.chapters',
  json_array(
    json_patch(json_extract(`content`, '$.figure'), json_object('id', 'badagoni-figure', 'imageFocus', 'center 17%')),
    json_patch(json_extract(`content`, '$.qvevri'), json_object('id', 'qvevri-tradition', 'imageFocus', '60% center'))
  )
)
WHERE `slug` = 'georgian-wine' AND json_extract(`content`, '$.figure') IS NOT NULL;
