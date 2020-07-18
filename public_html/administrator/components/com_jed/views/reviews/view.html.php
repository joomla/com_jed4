<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Registry\Registry;

/**
 * View for JED Reviews
 *
 * @package   Joomla.JED
 * @since     4.0.0
 */
class JedViewReviews extends HtmlView
{
	/**
	 * Form object for search filters
	 *
	 * @var    Form
	 * @since  4.0.0
	 */
	public $filterForm;

	/**
	 * The active search filters
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	public $activeFilters;

	/**
	 * An array of items
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $items;

	/**
	 * The pagination object
	 *
	 * @var    Pagination
	 * @since  4.0.0
	 */
	protected $pagination;

	/**
	 * The model state
	 *
	 * @var    Registry
	 * @since  4.0.0
	 */
	protected $state;

	/**
	 * Display method of reviews view
	 *
	 * @param   string  $tpl  The template name
	 *
	 * @return  string
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null)
	{
		/** @var JedModelReviews $model */
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
		$helper->addSubmenu('reviews');
		$this->sidebar = JHtmlSidebar::render();

		return parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return void
	 *
	 * @since  4.0.0
	 * @throws Exception
	 */
	protected function addToolBar()
	{
		$canDo = ContentHelper::getActions(
			'com_jed', 'review', $this->state->get('filter.published')
		);

		ToolBarHelper::title(Text::_('COM_JED_TITLE_REVIEWS'), 'star');

		if ($canDo->get('core.edit.state'))
		{
			ToolbarHelper::publish('reviews.publish', 'JTOOLBAR_PUBLISH', true);
			ToolbarHelper::unpublish(
				'reviews.unpublish', 'JTOOLBAR_UNPUBLISH', true
			);
		}
	}
}
