UPDATE `pages` SET `content` = json_set(`content`, '$.winery.image', '/images/winery.jpg') WHERE `slug` = 'story' AND json_extract(`content`, '$.winery.image') IS NULL;
