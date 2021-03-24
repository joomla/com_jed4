<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Jed\Component\Jed\Administrator\View\Email\HtmlView;

/** @var HtmlView $this */

Factory::getApplication()->getDocument()->getWebAssetManager()
	->useScript('form.validate')
	->useScript('keepalive')
	->usePreset('choicesjs');

?>
<form action="index.php?option=com_jed&view=extension&layout=edit&id=<?php echo (int) $this->item->id; ?>"
      method="post" name="adminForm" id="extension-form" class="form-validate">
    <div class="form-horizontal">
        <div class="span9">
            <div class="control-group">
                <div class="control-label"><?php echo $this->form->getLabel('subject'); ?></div>
                <div class="controls"><?php echo $this->form->getInput('subject'); ?></div>
            </div>
            <div class="control-group">
                <div class="control-label"><?php echo $this->form->getLabel('body'); ?></div>
                <div class="controls"><?php echo $this->form->getInput('body'); ?></div>
            </div>
        </div>
        <div class="span3">
            <section>
                <h3><?php echo Text::_('COM_JED_EMAIL_PLACEHOLDERS'); ?></h3>
                <ul>
                    <li>{USERNAME}</li>
                    <li>{NAME}</li>
                </ul>
            </section>
        </div>
    </div>

    <input type="hidden" name="task" value="" />
    <?php echo HTMLHelper::_('form.token'); ?>
</form>
