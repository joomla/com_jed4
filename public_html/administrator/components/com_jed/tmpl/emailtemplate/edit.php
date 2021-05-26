<?php
/**
 * @package       JED
 *
 * @subpackage    Tickets
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;


HTMLHelper::addIncludePath(JPATH_COMPONENT . '/helpers/html');
$wa = $this->document->getWebAssetManager();
$wa->getRegistry()->addExtensionRegistryFile('com_jed');
$wa->useScript('keepalive')
	->useScript('form.validate');
HTMLHelper::_('bootstrap.tooltip');

// Import CSS
$document = Factory::getDocument();
$document->addStyleSheet(Uri::root() . 'media/com_jed/css/form.css');
?>
<script type="text/javascript">
    js = jQuery.noConflict();
    js(document).ready(function () {

    });

    Joomla.submitbutton = function (task) {
        if (task == 'emailtemplate.cancel') {
            Joomla.submitform(task, document.getElementById('emailtemplate-form'));
        } else {

            if (task != 'emailtemplate.cancel' && document.formvalidator.isValid(document.id('emailtemplate-form'))) {

                Joomla.submitform(task, document.getElementById('emailtemplate-form'));
            } else {
                alert('<?php echo $this->escape(Text::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
            }
        }
    }
</script>

<form
        action="<?php echo Route::_('index.php?option=com_jed&layout=edit&id=' . (int) $this->item->id); ?>"
        method="post" enctype="multipart/form-data" name="adminForm" id="emailtemplate-form"
        class="form-validate form-horizontal">
	<?php echo $this->form->getLabel('title'); ?><br/>
	<?php echo $this->form->getInput('title'); ?><br/>

	<?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', array('active' => 'template')); ?>
	<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'template', Text::_('COM_JED_EMAILTEMPLATES_TAB_TEMPLATE', true)); ?>

    <div class="row">
        <div class="col-lg-9">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_EMAILTEMPLATES_FIELDSET_TEMPLATE_LABEL'); ?></legend>
				<?php echo $this->form->renderField('subject'); ?>
				<?php echo $this->form->renderField('template'); ?>
            </fieldset>
        </div>
        <div class="col-lg-3">
            <fieldset class="adminform">
                <legend>&nbsp;</legend>
				<?php echo $this->form->renderField('email_type'); ?>

				<?php echo $this->form->renderField('id'); ?>

				<?php echo $this->form->renderField('state'); ?>
            </fieldset>

        </div>
    </div>


	<?php echo HTMLHelper::_('uitab.endTab'); ?>
	<?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'Publishing', Text::_('COM_JED_GENERAL_TAB_PUBLISHING', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_FIELDSET_PUBLISHING'); ?></legend>
				<?php echo $this->form->renderField('created_by'); ?>
				<?php echo $this->form->renderField('modified_by'); ?>
				<?php echo $this->form->renderField('created'); ?>
				<?php echo $this->form->renderField('modified'); ?>
				<?php if ($this->state->params->get('save_history', 1)) : ?>
                    <div class="control-group">
                        <div class="control-label"><?php echo $this->form->getLabel('version_note'); ?></div>
                        <div class="controls"><?php echo $this->form->getInput('version_note'); ?></div>
                    </div>
				<?php endif; ?>
            </fieldset>
        </div>
    </div>
	<?php echo HTMLHelper::_('uitab.endTab'); ?>


	<?php echo HTMLHelper::_('uitab.endTabSet'); ?>

    <input type="hidden" name="task" value=""/>
	<?php echo HTMLHelper::_('form.token'); ?>

</form>
