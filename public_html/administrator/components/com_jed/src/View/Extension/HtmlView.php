<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Extension;

defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Toolbar\ToolbarFactoryInterface;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Jed\Component\Jed\Administrator\Model\ExtensionModel;

use function defined;

/**
 * JED Edit Extension View
 *
 * @since 4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * Form with settings
	 *
	 * @var    Form
	 *
	 * @since  4.0.0
	 */
	protected $form;

	/**
	 * The item object
	 *
	 * @var    object
	 * @since  4.0.0
	 */
	protected $item;

	/**
	 * The model state
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected $state;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise an Error object.
	 *
	 * @see     \JViewLegacy::loadTemplate()
	 *
	 * @since   4.0.0
	 *
	 * @throws  \Exception
	 */
	public function display($tpl = null)
	{
		/** @var ExtensionModel $model */
		$model       = $this->getModel();
		$this->item  = $model->getItem();
		$this->form  = $model->getForm();
		$this->state = $model->getState();

		$this->addToolBar();

		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since  4.0.0
	 *
	 * @throws \Exception
	 */
	private function addToolbar(): void
	{
		Factory::getApplication()->input->set('hidemainmenu', true);

		$canDo = ContentHelper::getActions('com_jed', 'extension');

		$title = !empty($this->item->title)
			? $this->item->title
			: Text::_(
				'JTOOLBAR_NEW'
			);
		ToolBarHelper::title($title, 'play');

		// If not checked out, can save the item.
		if ($canDo->get('core.edit') || $canDo->get('core.create'))
		{
			ToolBarHelper::apply('extension.apply');
			ToolBarHelper::save('extension.save');
		}

		$title = 'JTOOLBAR_CANCEL';

		if ($this->item->id)
		{
			$title = 'JTOOLBAR_CLOSE';
		}

		ToolBarHelper::cancel('extension.cancel', $title);
		ToolbarHelper::custom(
			'extension.preview', 'new-tab', '',
			'COM_JED_EXTENSIONS_VIEW_FRONTEND', false
		);
		ToolbarHelper::custom(
			'extension.download', 'arrow-down-4', '',
			'COM_JED_EXTENSIONS_DOWNLOAD_EXTENSION', false
		);

		$bar = Factory::getContainer()->get(ToolbarFactoryInterface::class)->createToolbar('toolbar');

		$bar->popupButton()
			->form('extension-form')
			->layout('joomla.toolbar.approve')
			->setOptions(
				[
					'title'    => Text::_('COM_JED_EXTENSIONS_APPROVE_STATE'),
					'approved' => $this->item->approved
				]
			)
			->text(Text::_('COM_JED_EXTENSIONS_APPROVE_STATE'))
			->selector('approveModal');

		$bar->popupButton()
			->form('extension-form')
			->layout('joomla.toolbar.publish')
			->setOptions(
				[
					'title'     => Text::_('COM_JED_EXTENSIONS_PUBLISH_STATE'),
					'published' => $this->item->published
				]
			)
			->text(Text::_('COM_JED_EXTENSIONS_PUBLISH_STATE'))
			->selector('publishModal');
	}
}
