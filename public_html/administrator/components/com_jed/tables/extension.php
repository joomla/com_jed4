<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Application\ApplicationHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Table\Table;

/**
 * JED Extension table class
 *
 * @since  4.0.0
 */
class TableExtension extends Table
{
	/**
	 * Constructor
	 *
	 * @param   JDatabaseDriver  $db  A database connector object
	 *
	 * @since   4.0.0
	 */
	public function __construct($db)
	{
		parent::__construct('#__jed_extensions', 'id', $db);
	}

	/**
	 * Overloaded check function
	 *
	 * @return  boolean
	 *
	 * @see     Table::check
	 * @since   4.0.0
	 */
	public function check(): bool
	{
		$date = Factory::getDate();
		$user = Factory::getUser();

		$this->set('modified_on', $date->toSql());

		// Existing item
		if ($this->get('id'))
		{
			$this->set('modified_by', $user->get('id'));
		}

		// Set alias
		if (trim($this->get('alias')) === '')
		{
			$this->set('alias', $this->get('title'));
		}

		$this->set('alias', ApplicationHelper::stringURLSafe($this->get('alias')));

		return true;
	}
}
