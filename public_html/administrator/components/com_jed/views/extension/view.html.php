<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die();

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Registry\Registry;

/**
 * JED Edit Extension View
 *
 * @since 4.0.0
 */
class JedViewExtension extends HtmlView
{
	/**
	 * Form with settings
	 *
	 * @var    Form
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
	 * @var    Registry
	 * @since  1.0.0
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
	 * @throws  Exception
	 */
	public function display($tpl = null)
	{
		/** @var JedModelExtension $model */
		$model        = $this->getModel();
		$this->item   = $model->getItem();
		$this->form   = $model->getForm();
		$this->state  = $model->getState();

		// Set the toolbar
		$this->addToolBar();

		// Display the template
		return parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since  4.0.0
	 *
	 * @throws Exception
	 */
	private function addToolbar(): void
	{
		Factory::getApplication()->input->set('hidemainmenu', true);

		$canDo = ContentHelper::getActions('com_jed', 'extension');

		$title = !empty($this->item->title) ? $this->item->title : Text::_('JTOOLBAR_NEW');
		ToolBarHelper::title($title, 'stack article');

		// If not checked out, can save the item.
		if ($canDo->get('core.edit') || $canDo->get('core.create'))
		{
			ToolBarHelper::apply('extension.apply');
			ToolBarHelper::save('extension.save');
			ToolbarHelper::save2new('extension.save2new');
		}

		if (empty($this->item->id))
		{
			ToolBarHelper::cancel('extension.cancel');
		}
		else
		{
			ToolBarHelper::cancel('extension.cancel', 'JTOOLBAR_CLOSE');
		}

		ToolbarHelper::custom('extension.preview', 'new-tab', '', 'COM_JED_EXTENSIONS_VIEW_FRONTEND', false);
		ToolbarHelper::custom('extension.download', 'file', '', 'COM_JED_EXTENSIONS_DOWNLOAD_EXTENSION', false);
	}

}
