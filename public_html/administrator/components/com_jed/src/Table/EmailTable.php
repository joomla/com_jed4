<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Table;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Table\Table;
use Joomla\Database\DatabaseDriver;

use function defined;

/**
 * Email table class
 *
 * @since  4.0.0
 */
class EmailTable extends Table
{
	/**
	 * Indicates that columns fully support the NULL value in the database
	 *
	 * @var    boolean
	 * @since  4.0.0
	 */
	protected $_supportNullValue = true;

	/**
	 * Constructor
	 *
	 * @param   DatabaseDriver  $db  A database connector object
	 * @since   4.0.0
	 */
	public function __construct($db)
	{
		parent::__construct('#__jed_emails', 'id', $db);
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

		if (!(int) $this->get('created'))
		{
			$this->set('created', $date->toSql());
		}

		if (!$this->get('modified'))
		{
			$this->set('modified', $this->get('created'));
		}

		$this->set('modified_on', $date->toSql());

		if ($this->get('id'))
		{
			$this->set('modified_by', $user->get('id'));
		}

		return true;
	}
}
