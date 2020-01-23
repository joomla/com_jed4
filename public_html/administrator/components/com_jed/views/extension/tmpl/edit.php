<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Uri\Uri;

/** @var JedViewExtension $this */

HTMLHelper::_('formbehavior.chosen');
HTMLHelper::_('behavior.formvalidator');
HTMLHelper::_('behavior.tabstate');

$extensionUrl = Uri::root() . 'extension/' . $this->item->alias;
$downloadUrl  = 'index.php?option=com_jed&task=extension.download&id=' . $this->item->id;

Factory::getDocument()->addScriptDeclaration(<<<JS
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
<form action="<?php echo Route::_('index.php?option=com_jed&view=extension&layout=edit&id=' . (int) $this->item->id); ?>"
      method="post" name="adminForm" id="extension-form" class="form-validate">

	<?php echo LayoutHelper::render('joomla.edit.title_alias', $this); ?>

    <div class="form-horizontal">
	    <?php echo $this->form->renderField('created_by'); ?>
	    <?php echo $this->form->renderField('jedChecker'); ?>
		<?php echo HTMLHelper::_('bootstrap.startTabSet', 'myTab', ['active' => 'general']); ?>

		<?php echo HTMLHelper::_(
			'bootstrap.addTab',
			'myTab',
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
		    'myTab',
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
		    'myTab',
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
		    'myTab',
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
		    'myTab',
		    'communication',
		    Text::_('COM_JED_EXTENSIONS_COMMUNICATION_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('communication'); ?>
                </div>
            </div>
        </div>
	    <?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	    <?php echo HTMLHelper::_(
	    	'bootstrap.addTab',
		    'myTab',
		    'history',
		    Text::_('COM_JED_EXTENSIONS_HISTORY_TAB')
	    ); ?>
        <div class="row-fluid">
            <div class="span12">
                <div class="form-horizontal">
				    <?php echo $this->form->renderFieldset('history'); ?>
                </div>
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
