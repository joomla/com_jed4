<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2011-2013 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

$registerLink = JRoute::_('index.php?Itemid=149');

if ($params->get('displayType') == 'modal')
{
    $loginClass = "";
    $registerClass = "";
    $spacer = JText::_('MOD_SCLOGIN_LOGINREG_SEPARATOR');

    if ($params->get('modalButtonStyle') == 'button')
    {
        $loginClass = 'class="btn btn-primary"';
        $registerClass = 'class="btn"';
        $spacer = "";
    }

    if ($helper->isJFBConnectInstalled)
        $modalName = JFBCFactory::config()->getSetting('jquery_load') ? 'sc-modal' : 'modal';
    else
        $modalName = $params->get('loadJQuery') ? 'sc-modal' : 'modal';

    echo '<div class="sourcecoast sclogin-modal-links sclogin"><a ' . $loginClass . ' href="#login-modal" role="button" data-toggle="' . $modalName . '">' . JText::_('MOD_SCLOGIN_LOGIN') . '</a>';
    if ($showRegisterLinkInModal)
        echo '' . '<a ' . $registerClass . ' href="' . $registerLink . '">' . JText::_('MOD_SCLOGIN_REGISTER_FOR_THIS_SITE') . '</a>';

    echo '<span class="badge badge-rounded"><i class="fa fa-user fa-inverse"></i></span>';

    echo '</div>';

    ob_start();
}
?>

    <div class="sclogin sourcecoast" id="sclogin-<?php echo $module->id; ?>">
        <?php if ($params->get('user_intro')): ?>
            <div class="sclogin-desc pretext">
                <?php echo $params->get('user_intro'); ?>
            </div>
        <?php endif; ?>

        <div class="row-fluid">
            <?php
            require(JModuleHelper::getLayoutPath("mod_sclogin", "joomlaLogin_" . $layout));
            require(JModuleHelper::getLayoutPath('mod_sclogin', "socialLogin"));
            ?>
        </div>

        <?php echo $helper->getPoweredByLink(); ?>
        <div class="clearfix"></div>
    </div>

<?php

if ($params->get('displayType') == 'modal')
{
    $modalContents = ob_get_clean();
    $doc = JFactory::getDocument();
    if ($doc->getType() == 'html')
    {
    	echo '<div id="login-modal" class="modal hide fade">
  <div class="modal-header">
    <h3>Login</h3>
  </div>
  <div class="modal-body">
    ' . $modalContents. '
  </div>

</div>';

/*         echo '<script type="text/javascript">
jfbcJQuery(document).ready(function() {
    jfbcJQuery("#login-modal").appendTo("body");
});
jfbcJQuery("#login-modal").on("show", function() {
       // jfbcJQuery("#login-modal").css({"margin-left": function() {return -(jfbcJQuery("#login-modal").width() / 2)}})
        });
</script>'; */
    }
}
