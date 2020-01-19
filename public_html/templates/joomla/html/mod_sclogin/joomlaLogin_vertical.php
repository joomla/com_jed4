<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2011-2013 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

if ($registerType == "communitybuilder" && file_exists(JPATH_ADMINISTRATOR . '/components/com_comprofiler/plugin.foundation.php'))
    $passwordName = 'passwd';
else
    $passwordName = 'password';

if ($params->get('showLoginForm'))
{
    if ($params->get('forgotColor') == 'white')
        $forgotColor = ' icon-white';
    else
        $forgotColor = '';

    $forgotUsername = $helper->getForgotUser($params->get('register_type'), $params->get('showForgotUsername'), $forgotLink, $forgotUsernameLink, $forgotColor);
    $forgotPassword = $helper->getForgotPassword($params->get('register_type'), $params->get('showForgotPassword'), $forgotLink, $forgotPasswordLink, $forgotColor);
    ?>

    <div class="sclogin-joomla-login vertical <?php echo $joomlaSpan; ?>">
        <form action="<?php echo JRoute::_('index.php', true, $params->get('usesecure')); ?>" method="post" id="sclogin-form<?php echo $module->id; ?>">
            <fieldset class="input-block-level userdata">
                <div class="control-group" id="form-sclogin-username">
                    <div class="controls input-block-level">
                        <div class="input-append span11">
                            <input name="username" tabindex="1" id="sclogin-username" class="input-block-level" type="text"
                                   placeholder="<?php echo JText::_('MOD_SCLOGIN_USERNAME'); ?>">
                            <?php echo $forgotUsername; ?>
                        </div>
                    </div>
                </div>
                <div class="control-group" id="form-sclogin-password">
                    <div class="controls input-block-level">
                        <div class="input-append span11">
                            <input name="<?php echo $passwordName; ?>" tabindex="2" id="sclogin-passwd" class="input-block-level" type="password"
                                   placeholder="<?php echo JText::_('MOD_SCLOGIN_PASSWORD') ?>">
                            <?php echo $forgotPassword; ?>
                        </div>
                    </div>
                </div>
                <div class="control-group" id="form-sclogin-submitcreate">
                    <button type="submit" name="Submit" class="btn btn-primary <?php if (!$showRegisterLinkInLogin)
                    {
                        echo 'span12';
                    } ?>"><?php echo JText::_('MOD_SCLOGIN_LOGIN') ?></button>
                    <?php if ($showRegisterLinkInLogin) : ?>
                        <a class="btn" href="<?php echo $registerLink; ?>"><?php echo JText::_('MOD_SCLOGIN_REGISTER_FOR_THIS_SITE'); ?></a>
                    <?php endif; ?>
                </div>
                <?php if (JPluginHelper::isEnabled('system', 'remember')) : ?>
                    <div class="control-group" id="form-sclogin-remember">
                        <label for="sclogin-remember">
                            <input id="sclogin-remember" type="checkbox" name="remember" class="inputbox" value="yes" />
                            <?php echo JText::_('JGLOBAL_REMEMBER_ME'); ?>
                        </label>
                    </div>
                <?php endif; ?>


                <?php
                if ($registerType == "communitybuilder" && file_exists(JPATH_ADMINISTRATOR . '/components/com_comprofiler/plugin.foundation.php')) // Use Community Builder's login
                {
                    include_once(JPATH_ADMINISTRATOR . '/components/com_comprofiler/plugin.foundation.php');
                    global $_CB_framework;
                    echo '<input type="hidden" name="option" value="com_comprofiler" />' . "\n";
                    echo '<input type="hidden" name="task" value="login" />' . "\n";
                    echo '<input type="hidden" name="op2" value="login" />' . "\n";
                    echo '<input type="hidden" name="lang" value="' . $_CB_framework->getCfg('lang') . '" />' . "\n";
                    echo '<input type="hidden" name="force_session" value="1" />' . "\n"; // makes sure to create joomla 1.0.11+12 session/bugfix
                    echo '<input type="hidden" name="return" value="B:' . base64_encode(cbSef(base64_decode($jLoginUrl))) . '"/>';
                    echo cbGetSpoofInputTag('login');
                }
                else
                {
                    echo '<input type="hidden" name="option" value="com_users"/>';
                    echo '<input type="hidden" name="task" value="user.login"/>';
                    echo '<input type="hidden" name="return" value="' . $jLoginUrl . '"/>';
                }
                echo '<input type="hidden" name="mod_id" value="' . $module->id . '"/>';
                echo JHTML::_('form.token'); ?>

            </fieldset>
        </form>
    </div>
<?php
}