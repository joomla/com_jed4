<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\ToolbarHelper;

/**
 * View for JED Extensions.
 *
 * @package  JED
 * @since    4.0.0
 */
class JedViewExtensions extends HtmlView
{
	/**
	 * Form object for search filters
	 *
	 * @var     Form
	 * @since   4.0.0
	 */
	public $filterForm;
	/**
	 * The active search filters
	 *
	 * @var     array
	 * @since   4.0.0
	 */
	public $activeFilters = [];
	/**
	 * An array of items
	 *
	 * @var     array
	 * @since   4.0.0
	 */
	protected $items = [];
	/**
	 * The pagination object
	 *
	 * @var     Pagination
	 * @since   4.0.0
	 */
	protected $pagination;
	/**
	 * The model state
	 *
	 * @var     CMSObject
	 * @since   4.0.0
	 */
	protected $state;

	/**
	 * The sidebar menu
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $sidebar = '';

	/**
	 * Display method of extensions view
	 *
	 * @param   string  $tpl  The template name
	 *
	 * @return  string
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function display($tpl = null)
	{
		/** @var JedModelExtensions $model */
		$model               = $this->getModel();
		$this->state         = $model->getState();
		$this->items         = $model->getItems();
		$this->pagination    = $model->getPagination();
		$this->filterForm    = $model->getFilterForm();
		$this->activeFilters = $model->getActiveFilters();
		$errors              = $model->getErrors();

		if ($errors && count($errors))
		{
			throw new RuntimeException(implode("\n", $errors), 500);
		}

		// Add the toolbar
		$this->addToolBar();

		$helper = new JedHelper;
		$helper->addSubmenu('extensions');
		$this->sidebar = JHtmlSidebar::render();

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
	protected function addToolBar(): void
	{
		$canDo = ContentHelper::getActions('com_jed', 'extension');

		ToolBarHelper::title(Text::_('COM_JED_TITLE_EXTENSIONS'), 'play');

		if ($canDo->get('core.create'))
		{
			ToolbarHelper::addNew('extension.add');
		}

		if ($canDo->get('core.edit') || $canDo->get('core.edit.own'))
		{
			ToolbarHelper::editList('extension.edit');
		}

		if ($canDo->get('core.edit.state'))
		{
			ToolbarHelper::publish(
				'extensions.publish', 'JTOOLBAR_PUBLISH', true
			);
			ToolbarHelper::unpublish(
				'extensions.unpublish', 'JTOOLBAR_UNPUBLISH', true
			);
		}

		if ($canDo->get('core.edit.state'))
		{
			ToolbarHelper::checkin('extensions.checkin');
		}

		ToolBarHelper::cancel('extensions.cancel', 'JTOOLBAR_CLOSE');
	}
}
