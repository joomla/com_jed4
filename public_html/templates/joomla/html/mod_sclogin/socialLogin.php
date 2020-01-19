<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2011-2013 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

if ($loginButtons != '')
{
    ?>
    <div class="sclogin-social-login <?php echo $socialSpan . ' ' . $layout . ' ' . $orientation; ?>">
        <?php echo $loginButtons; ?>
    </div>
<?php
}