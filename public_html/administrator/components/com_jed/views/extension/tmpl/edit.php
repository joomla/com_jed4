<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Uri\Uri;

/** @var JedViewExtension $this */

HTMLHelper::_('formbehavior.chosen');
HTMLHelper::_('behavior.formvalidator');
HTMLHelper::_('behavior.tabstate');
HTMLHelper::_('script', 'com_jed/jed.js', ['version' => 'auto', 'relative' => true]);

Text::script('COM_JED_EXTENSIONS_ERROR_DURING_SEND_EMAIL', true);
Text::script('COM_JED_EXTENSIONS_MISSING_MESSAGE_ID', true);
Text::script('COM_JED_EXTENSIONS_MISSING_DEVELOPER_ID', true);
Text::script('COM_JED_EXTENSIONS_MISSING_EXTENSION_ID', true);

$extensionUrl = Uri::root() . 'extension/' . $this->item->alias;
$downloadUrl  = 'index.php?option=com_jed&task=extension.download&id=' . $this->item->id;

Factory::getDocument()
    ->addScriptOptions('joomla.userId', Factory::getUser()->id, false)
    ->addScriptDeclaration(<<<JS
	Joomla.submitbutton = function(task)
	{
	    switch (task) {
            case 'extension.preview':
                window.open('{$extensionUrl}');
                break;
            case 'extension.download':
                window.open('{$downloadUrl}');
                break;
            default:
                if (task === "extension.cancel" || document.formvalidator.isValid(document.getElementById("extension-form")))
                {
                    Joomla.submitform(task, document.getElementById("extension-form"));
                }
                break;
	    }
	}
JS
);
?>
<form action="index.php?option=com_jed&view=extension&layout=edit&id=<?php echo (int) $this->item->id; ?>"
      method="post" name="adminForm" id="extension-form" class="form-validate">

	<?php echo LayoutHelper::render('joomla.edit.title_alias', $this); ?>

    <div class="form-horizontal">
	    <?php echo $this->form->renderField('created_by'); ?>
	    <?php echo $this->form->renderField('jedChecker'); ?>
		<?php echo HTMLHelper::_('bootstrap.startTabSet', 'extensionTab', ['active' => 'general']); ?>

		<?php echo HTMLHelper::_(
			'bootstrap.addTab',
			'extensionTab',
			'general',
			Text::_('COM_JED_EXTENSIONS_INFO_TAB')
		); ?>
        <div class="row-fluid form-horizontal-desktop">
            <div class="span9">
                <div class="form-horizontal">
					<?php echo $this->form->renderFieldset('info'); ?>
                </div>
            </div>
            <div class="span3">
                <div class="form-vertical">
					<?php echo $this->form->renderFieldset('publication'); ?>
                </div>
            </div>
        </div>
		<?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
	    	'bootstrap.addTab',
		    'extensionTab',
		    'info',
		    Text::_('COM_JED_EXTENSIONS_CONTENT_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('content'); ?>
                </div>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
		    'bootstrap.addTab',
		    'extensionTab',
		    'image',
		    Text::_('COM_JED_EXTENSIONS_CONTENT_IMAGE')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('image'); ?>
                </div>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
	    	'bootstrap.addTab',
		    'extensionTab',
		    'pricing',
		    Text::_('COM_JED_EXTENSIONS_PRICING_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('pricing'); ?>
                </div>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
	    	'bootstrap.addTab',
		    'extensionTab',
		    'reviews',
		    Text::_('COM_JED_EXTENSIONS_REVIEWS_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('reviews'); ?>
                </div>
                <?php echo HTMLHelper::_(
                        'link',
                        'index.php?option=com_jed&view=reviews&filter[extension]=' . $this->item->id,
                        Text::_('COM_JED_EXTENSIONS_REVIEW_LINK') . ' <span class="icon-new-tab"></span>',
                        'target="_blank"'
                        );
                ?>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
	    	'bootstrap.addTab',
		    'extensionTab',
		    'communication',
		    Text::_('COM_JED_EXTENSIONS_COMMUNICATION_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('communication'); ?>
                    <div class="control-group">
                        <div class="control-label">
                        </div>
                        <div class="controls">
                            <button class="btn btn-success js-messageType js-sendMessage" onclick="jed.sendMessage(); return false;">
		                        <?php echo Text::_('COM_JED_SEND_EMAIL'); ?>
                            </button>

                            <button class="btn btn-success js-messageType js-storeNote" style="display: none;" onclick="jed.storeNote(); return false;">
		                        <?php echo Text::_('COM_JED_STORE_NOTE'); ?>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
	    	'bootstrap.addTab',
		    'extensionTab',
		    'history',
		    Text::_('COM_JED_EXTENSIONS_HISTORY_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <table class="table table-striped table-condensed">
                    <thead>
                    <tr>
                        <td><?php echo Text::_('COM_JED_EXTENSION_HISTORY_DATE'); ?></td>
                        <td><?php echo Text::_('COM_JED_EXTENSION_HISTORY_TYPE'); ?></td>
                        <td><?php echo Text::_('COM_JED_EXTENSION_HISTORY_TEXT'); ?></td>
                        <td><?php echo Text::_('COM_JED_EXTENSION_HISTORY_MEMBER'); ?></td>
                        <td><?php echo Text::_('COM_JED_EXTENSION_HISTORY_USER'); ?></td>
                    </tr>
                    </thead>
                    <tbody>
                <?php
                foreach ($this->item->history as $history):
                    ?><tr><?php
	                ?><td><?php echo HTMLHelper::_('date', $history->logDate, Text::_('DATE_FORMAT_LC6')); ?></td><?php
	                ?><td><?php echo Text::_('COM_JED_EXTENSION_HISTORY_LOG_' . $history->type); ?></td><?php

                    if ($history->type === 'mail')
                    {
                        ?><td>
                        <?php echo $history->subject; ?>
                        <?php echo $history->body; ?>
                        </td><?php
                        ?><td><?php echo $history->memberName; ?></td><?php
                        ?><td><?php echo HTMLHelper::_('link', 'index.php?option=com_users&task=user.edit&id=' . $history->developerId, $history->developerName); ?> &lt;<?php echo $history->developerEmail; ?>&gt;</td><?php
                    }
	                if ($history->type === 'note')
	                {
		                ?><td>
		                <?php echo $history->body; ?>
                        </td><?php
		                ?><td><?php echo $history->memberName; ?></td><?php
		                ?><td><?php echo HTMLHelper::_('link', 'index.php?option=com_users&task=user.edit&id=' . $history->developerId, $history->developerName); ?></td><?php
	                }
                    elseif ($history->type === 'actionLog')
                    {
                        ?><td><?php echo ActionlogsHelper::getHumanReadableLogMessage($history); ?></td><?php
	                    ?><td><?php echo $history->name; ?></td><?php
                        ?><td></td><?php
                    }
                    ?></tr><?php
                endforeach;
                ?>
                    </tbody>
                </table>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_('bootstrap.endTabSet'); ?>

    </div>

	<?php echo HTMLHelper::_(
		'bootstrap.renderModal',
		'approveModal',
		[
			'title'  => Text::_('COM_JED_EXTENSIONS_APPROVE_STATE'),
			'footer' => $this->loadTemplate('approve_footer'),
            'modalWidth' => '30vh'
		],
		$this->loadTemplate('approve_body')
	); ?>

	<?php echo HTMLHelper::_(
		'bootstrap.renderModal',
		'publishModal',
		[
			'title'  => Text::_('COM_JED_EXTENSIONS_PUBLISH_STATE'),
			'footer' => $this->loadTemplate('publish_footer'),
			'modalWidth' => '30vh'
		],
		$this->loadTemplate('publish_body')
	); ?>

    <input type="hidden" name="option" value="com_jed"/>
    <input type="hidden" name="task" value=""/>
    <input type="hidden" name="boxchecked" value="0"/>
	<?php echo HTMLHelper::_('form.token'); ?>
</form>
