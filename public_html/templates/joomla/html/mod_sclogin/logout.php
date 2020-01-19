<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2011-2013 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

?>
<div class="sclogin sourcecoast sclogin-out">

<?php
if ($params->get('enableProfilePic'))
    echo $helper->getSocialAvatar($registerType, $profileLink, $user);

if ($params->get('greetingName') != 2)
{
    if ($params->get('greetingName') == 0)
        $name = $user->get('username');
    else
        $name = $user->get('name');
}
?>
<a href="<?php echo JRoute::_('index.php?option=com_jed&view=profile&layout=details&id=-1&Itemid=155')?>">
	<?php echo JText::_('FABRIK_PROFILE'); ?>
</a>
<?php
if ($params->get('showLogoutButton'))
{ ?>
    <div class="sclogout-button">
        <div class="sclogin-joomla-login">
            <form action="<?php echo JRoute::_('index.php', true, $params->get('usesecure'));?>" method="post" id="sclogin-form">
                <div class="logout-button" id="scLogoutButton">
                    <button type="submit" name="Submit" class="button btn btn-small">
                       <?php echo JText::_('JLOGOUT');?>
                       <span class="fa fa-user"></span>
                     </button>
                    <input type="hidden" name="option" value="com_users" />
                    <input type="hidden" name="task" value="user.logout" />
                    <input type="hidden" name="return" value="<?php echo $jLogoutUrl;?>" />
                    <?php echo JHtml::_('form.token')?>
                </div>
            </form>
        </div>


    </div>
<?php
}

if ($params->get('showUserMenu'))
{
    echo $helper->getUserMenu($params->get('showUserMenu'), $params->get('userMenuStyle'));
}

if ($params->get('showConnectButton'))
{ ?>
    <div class="sclogin-social-connect">
        <?php echo $helper->getReconnectButtons($addClearfix, $params->get('loginButtonType'), $params->get('socialButtonsOrientation'), $params->get('socialButtonsAlignment'), $params->get('loginButtonSize'), $params->get('facebookLoginButtonLinkImage'), $params->get('linkedInLoginButtonLinkImage'), $params->get('googleLoginButtonLinkImage'), $params->get('twitterLoginButtonLinkImage'));?>
    </div>
<?php
}

echo $helper->getPoweredByLink();
?>
</div>
