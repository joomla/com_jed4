<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Registry\Registry;

/**
 * View for JED Home.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedViewHome extends HtmlView
{
	/**
	 * The form filter
	 *
	 * @var    Form
	 * @since  4.0.0
	 */
	public $filterForm;

	/**
	 * The active filters
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	public $activeFilters = [];

	/**
	 * List of items to show
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $items = [];

	/**
	 * Pagination object
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
	 * The general helper
	 *
	 * @var    object
	 * @since  4.0.0
	 */
	protected $helper;

	/**
	 * The sidebar menu
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $sidebar = '';

	/**
	 * List of total statistics
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $totals = [];

	/**
	 * Last 5 reviews
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $reviews = [];

	/**
	 * Last 5 tickets
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $tickets = [];

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
		/** @var JedModelHome $model */
		$model         = $this->getModel();
		$this->totals  = $model->getTotals();
		$this->reviews = $model->getReviews();
		$this->tickets = $model->getTickets();

		$this->addToolbar();

		$helper = new JedHelper;
		$helper->addSubmenu('home');
		$this->sidebar = JHtmlSidebar::render();

		return parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @since  4.0.0
	 */
	private function addToolbar(): void
	{
		ToolBarHelper::title(Text::_('COM_JED'));

		$user  = Factory::getUser();

		if ($user->authorise('core.admin', 'com_jed') || $user->authorise('core.options', 'com_jed'))
		{
			ToolbarHelper::preferences('com_jed');
		}
	}
}
