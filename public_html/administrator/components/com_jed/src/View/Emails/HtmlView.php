<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\View\Emails;

\defined('_JEXEC') or die;

use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\object\CMSObject;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Toolbar\ToolbarHelper;

/**
 * Emails list
 *
 * @since   4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * JED helper
	 *
	 * @var    JedHelper
	 * @since  4.0.0
	 */
	protected $helper;

	/**
	 * List of items
	 *
	 * @var    array
	 * @since  4.0.0
	 */
	protected $items = [];

	/**
	 * The pagination object
	 *
	 * @var    Pagination
	 * @since  4.0.0
	 */
	protected $pagination;

	/**
	 * Access rights of a user
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected $canDo;

	/**
	 * Execute and display a template script.
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise a JError object.
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null)
	{
		/** @var JedModelEmails $model */
		$model            = $this->getModel();
		$this->items      = $model->getItems();
		$this->pagination = $model->getPagination();
		$this->canDo      = ContentHelper::getActions('com_jed');

		$this->toolbar();

		return parent::display($tpl);
	}

	/**
	 * Displays a toolbar for a specific page.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	private function toolbar(): void
	{
		ToolbarHelper::title(Text::_('COM_JED_TITLE_EMAILS'), 'mail');

		if ($this->canDo->get('core.create'))
		{
			ToolbarHelper::addNew('email.add');
		}

		if ($this->canDo->get('core.edit') || $this->canDo->get('core.edit.own'))
		{
			ToolbarHelper::editList('email.edit');
		}

		if ($this->canDo->get('core.delete'))
		{
			ToolbarHelper::deleteList('JGLOBAL_CONFIRM_DELETE', 'emails.delete', 'JTOOLBAR_DELETE');
		}

		if ($this->canDo->get('core.create'))
		{
			ToolbarHelper::custom('emails.testemail', 'mail', 'mail', Text::_('COM_JED_SEND_TESTEMAIL'));
		}
	}
}
