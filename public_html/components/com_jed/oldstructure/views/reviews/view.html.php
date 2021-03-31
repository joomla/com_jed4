<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Pagination\Pagination;

/**
 * JED view.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedViewReviews extends HtmlView
{
	/**
	 * List of extensions
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $items = [];

	/**
	 * The pagination object
	 *
	 * @var    Pagination
	 *
	 * @since  4.0.0
	 */
	protected $pagination;

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
	 * @return  mixed  A string if successful, otherwise a Error object.
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception When an error occurs in the Model
	 */
	public function display($tpl = null)
	{
		/** @var JedModelReviews $model */
		$model            = $this->getModel();
		$this->items      = $model->getItems();

		$this->state      = $model->getState();
		$this->pagination = $model->getPagination();

		if (count($errors = $model->getErrors()))
		{
			throw new RuntimeException(Text::sprintf('JLIB_APPLICATION_ERROR_UNHELD_ID', 0), 503);
		}

		return parent::display($tpl);
	}
}
