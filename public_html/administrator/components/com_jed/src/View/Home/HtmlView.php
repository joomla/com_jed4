<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\View\Home;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Joomla\Component\Jed\Administrator\Model\HomeModel;
use Joomla\Registry\Registry;

use function defined;

/**
 * View for JED Home.
 *
 * @package   JED
 * @since     4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * The form filter
	 *
	 * @var    Form|null
	 * @since  4.0.0
	 */
	public ?Form $filterForm;

	/**
	 * The active filters
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	public array $activeFilters = [];

	/**
	 * List of items to show
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected array $items = [];

	/**
	 * Pagination object
	 *
	 * @var    Pagination
	 * @since  4.0.0
	 */
	protected Pagination $pagination;

	/**
	 * The model state
	 *
	 * @var    Registry
	 * @since  4.0.0
	 */
	protected Registry $state;

	/**
	 * List of total statistics
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected array $totals = [];

	/**
	 * Last 5 reviews
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected array $reviews = [];

	/**
	 * Last 5 tickets
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected array $tickets = [];

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null): void
	{
		/** @var HomeModel $model */
		$model         = $this->getModel();
		$this->totals  = $model->getTotals();
		$this->reviews = $model->getReviews();
		$this->tickets = $model->getTickets();

		$this->addToolbar();

		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @since  4.0.0
	 */
	private function addToolbar(): void
	{
		ToolBarHelper::title(Text::_('COM_JED'));

		$user = Factory::getApplication()->getIdentity();

		if ($user->authorise('core.admin', 'com_jed')
			|| $user->authorise(
				'core.options', 'com_jed'
			))
		{
			ToolbarHelper::preferences('com_jed');
		}
	}
}
