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

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;


HTMLHelper::addIncludePath(JPATH_COMPONENT . '/helpers/html');
$wa = $this->document->getWebAssetManager();
$wa->useScript('keepalive')
    ->useScript('form.validate');
HTMLHelper::_('bootstrap.tooltip');
?>

<form
        action="<?php echo Route::_('index.php?option=com_jed&layout=edit&id=' . (int)$this->item->id); ?>"
        method="post" enctype="multipart/form-data" name="adminForm" id="jedticket-form"
        class="form-validate form-horizontal">


    <?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', array('active' => 'ticket')); ?>
    <?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'ticket', Text::_('COM_JED_TAB_TICKET', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_FIELDSET_TICKET'); ?></legend>
                <?php echo $this->form->renderField('id'); ?>
                <?php echo $this->form->renderField('ticket_origin'); ?>
                <?php echo $this->form->renderField('ticket_category_type'); ?>
                <?php echo $this->form->renderField('ticket_subject'); ?>
                <?php echo $this->form->renderField('ticket_text'); ?>
                <?php echo $this->form->renderField('internal_notes'); ?>
                <?php echo $this->form->renderField('uploaded_files_preview'); ?>
                <?php echo $this->form->renderField('uploaded_files_location'); ?>
                <?php echo $this->form->renderField('allocated_group'); ?>
                <?php echo $this->form->renderField('allocated_to'); ?>
                <?php echo $this->form->renderField('linked_item_type'); ?>
                <?php echo $this->form->renderField('linked_item_id'); ?>
                <?php echo $this->form->renderField('ticket_status'); ?>
                <?php echo $this->form->renderField('parent_id'); ?>
            </fieldset>
        </div>
    </div>
    <?php echo HTMLHelper::_('uitab.endTab'); ?>
    <?php echo HTMLHelper::_('uitab.addTab', 'myTab', 'Publishing', Text::_('COM_JED_TAB_PUBLISHING', true)); ?>
    <div class="row-fluid">
        <div class="span10 form-horizontal">
            <fieldset class="adminform">
                <legend><?php echo Text::_('COM_JED_FIELDSET_PUBLISHING'); ?></legend>
                <?php echo $this->form->renderField('state'); ?>
                <?php echo $this->form->renderField('created_by'); ?>
                <?php echo $this->form->renderField('created_on'); ?>
                <?php echo $this->form->renderField('modified_by'); ?>
                <?php echo $this->form->renderField('modified_on'); ?>
            </fieldset>
        </div>
    </div>
    <?php echo HTMLHelper::_('uitab.endTab'); ?>


    <?php echo HTMLHelper::_('uitab.endTabSet'); ?>

    <input type="hidden" name="task" value=""/>
    <?php echo HTMLHelper::_('form.token'); ?>

</form>
