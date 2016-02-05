<?php
/**
* The install path on your server, if it's in the root ie. http://altpresskit.grapefrukt.com leave it empty
* If in a subfolder like http://grapefrukt.com/presskit/, put presskit/ below. The trailing slash is important!
* To make the nice URLs work, you will also need to set your base path in the .htaccess file
*/
set('BASE_PATH', '');

/**
* Some hosts break the autodetect of mod_rewrite, set this to true to override the autodetect
*/
set('FORCE_MOD_REWRITE', 'false');

/**
* Promoter overwrite
* Set to true (default), to have your promoter reviews overwrite any locally defined reviews
* Set to false to append any reviews from promoter to the locally defined list
*/
set('PROMOTER_OVERWRITE', true);

/**
* Promoter cache
* The number of seconds before locally cached copy of promoter data is invalidated (defaults to 1 hour)
*/
set('PROMOTER_CACHE_DURATION', 1 * 60 * 60);

/**
* Auto update type
* 0 = never check
* 1 = check and display notification
* 2 = check and install automatically (experimental, may break things in crazy ways, HERE BE DRAGONS)
*/
set('UPDATE_TYPE', 1);

/**
* Update check frequency (Only applies if UPDATE_TYPE is set to 1 or higher)
* The number of seconds before rechecking if up to date with github (defaults to 7 days)
*/
set('UPDATE_FREQUENCY', 7 * 24 * 60 * 60);

/**
* E-mail settings
* Send to: The email that will receive the press request (Required)
* SMTP server adress, leave blank to use PHPs standard email() 
* SMTP username, only required if using SMTP
* SMTP password, only required if using SMTP
* SMTP encrytion, only required if using SMTP, set to ssl or tls. set to blank to not use encrytion.
*/
set('EMAIL_SEND_TO', '');

set('EMAIL_SMTP_SERVER', '');
set('EMAIL_SMTP_USER', '');
set('EMAIL_SMTP_PASS', '');
set('EMAIL_ENCRYPTION', 'ssl');

?>