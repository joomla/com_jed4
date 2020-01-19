<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2011-2013 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');
$modId = JRequest::getInt('mod_id');
?>
<div class="sclogin-joomla-login">
    <?php echo JText::sprintf('MOD_SCLOGIN_SECRETKEY_LABEL', JRequest::getVar('u', '', 'POST', 'username')); ?>
    <form method="post" id="sclogin-form-otp-<?php echo $modId ?>">
        <fieldset class="userdata span12">
            <div class="control-group pull-left" id="form-sclogin-secretkey">
                <div class="controls">
                    <div class="input-append">
                        <input name="secretkey" tabindex="1" id="sclogin-input-secretkey" type="text" class="input-medium"
                               placeholder="<?php echo JText::_('MOD_SCLOGIN_SECRETKEY'); ?>">
                    </div>
                </div>
            </div>
        </fieldset>
        <button type="submit" name="Submit" class="btn btn-primary otp"><?php echo JText::_('MOD_SCLOGIN_LOGIN') ?></button>
        <button type="button" name="Cancel" class="btn cancel" onclick="sclogin.otp.reset('<?php echo $modId; ?>');">Cancel</button>
    </form>

</div>