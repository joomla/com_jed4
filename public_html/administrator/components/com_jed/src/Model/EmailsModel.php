<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Model;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\ListModel;
use Joomla\Database\QueryInterface;
use RuntimeException;

/**
 * Emails model
 *
 * @since   4.0.0
 */
class EmailsModel extends ListModel
{
	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @param   string  $ordering   An optional ordering field.
	 * @param   string  $direction  An optional direction (asc|desc).
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		if ($ordering === null)
		{
			$ordering = 'id';
		}

		if ($direction === null)
		{
			$direction = 'DESC';
		}

		parent::populateState($ordering, $direction);
	}

	/**
	 * Build an SQL query to load the list data.
	 *
	 * @return  QueryInterface
	 *
	 * @since   4.0.0
	 * @throws  RuntimeException
	 */
	protected function getListQuery()
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		$query->select(
			$db->quoteName(
				[
					'emails.id',
					'emails.subject',
					'emails.body',
					'emails.checked_out',
					'emails.checked_out_time',
					'users.name'
				],
				[
					'id',
					'subject',
					'body',
					'checked_out',
					'checked_out_time',
					'editor'
				]
			)
		);

		$query->from($db->quoteName('#__jed_emails', 'emails'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('emails.checked_out')
			);

		$query->order(
			$db->quoteName(
				$db->escape(
					$this->getState('list.ordering', 'id')
				)
			) . ' ' . $db->escape($this->getState('list.direction', 'DESC'))
		);

		return $query;
	}
}
