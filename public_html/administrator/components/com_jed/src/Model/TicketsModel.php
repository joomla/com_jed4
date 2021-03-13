<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Model;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Table\Table;

use function defined;

/**
 * Tickets Model
 *
 * @package  JED
 * @since    4.0.0
 */
class TicketsModel extends ListModel
{
	/**
	 * Constructor.
	 *
	 * @param   array  $config  An optional associative array of configuration settings.
	 *
	 * @see     ListModel
	 * @since   4.0.0
	 */
	public function __construct($config = [])
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = [
				'published',
				'reviewer',
				'extension',
				'ipaddress',
				'flagged',
				'developer',
				'developer_id',

				'reviews.published',
				'reviews.created_on',
				'reviews.title',
				'reviews.overallScore',
				'users.username',
				'extensions.title',
				'extensions.created_by',
				'reviews.ipAddress',
				'reviews.flagged',
				'reviews.id'
			];
		}

		parent::__construct($config);
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * @param   string  $ordering   The ordering field
	 * @param   string  $direction  The ordering direction
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @since   4.0.0
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		if ($ordering === null)
		{
			$ordering = 'tickets.id';
		}

		if ($direction === null)
		{
			$direction = 'DESC';
		}

		parent::populateState($ordering, $direction);
	}

	/**
	 * Method to get a store id based on model configuration state.
	 *
	 * This is necessary because the model is used by the component and
	 * different modules that might need different sets of data or different
	 * ordering requirements.
	 *
	 * @param   string  $id  A prefix for the store id.
	 *
	 * @return  string  A store id.
	 * @since   4.0.0
	 */
	protected function getStoreId($id = '')
	{
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.published');
		$id .= ':' . $this->getState('filter.extension');

		return parent::getStoreId($id);
	}

	/**
	 * Method to build an SQL query to load the list data.
	 *
	 * @return  string  An SQL query
	 * @since   4.0.0
	 */
	protected function getListQuery()
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		$query->select(
			$db->quoteName(
				[
					'tickets.published',
					'tickets.id',
					'tickets.title',
					'tickets.created_on',
					'tickets.extension_id',
					'tickets.created_by',
					'users.id',
					'users.username',
					'extensions.title',
					'extensions.created_by',
				],
				[
					'published',
					'id',
					'title',
					'created_on',
					'extensionId',
					'created_by',
					'userId',
					'username',
					'extensionname',
					'developerId',
				]
			)
		)
			->from($db->quoteName('#__jed_tickets', 'tickets'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName(
					'tickets.created_by'
				)
			)
			->leftJoin(
				$db->quoteName('#__jed_extensions', 'extensions')
				. ' ON ' . $db->quoteName('extensions.id') . ' = '
				. $db->quoteName('tickets.extension_id')
			)
			->leftJoin(
				$db->quoteName('#__users', 'developers')
				. ' ON ' . $db->quoteName('developers.id') . ' = '
				. $db->quoteName('extensions.created_by')
			);

		$search = $this->getState('filter.search');

		if (!empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where(
					$db->quoteName('tickets.id') . ' = ' . (int) substr(
						$search, 3
					)
				);
			}
			else
			{
				$search = $db->quote('%' . $db->escape($search, true) . '%');
				$query->where(
					$db->quoteName('tikets.title') . ' LIKE ' . $search
				);
			}
		}

		$published = $this->getState('filter.published');

		if (is_numeric($published))
		{
			$query->where(
				$db->quoteName('tickets.published') . ' = ' . (int) $published
			);
		}

		$extension = $this->getState('filter.extension');

		if (is_numeric($extension))
		{
			$query->where(
				$db->quoteName('tickets.extension_id') . ' = '
				. (int) $extension
			);
		}

		$developerId = $this->getState('filter.developer_id');

		if (is_numeric($developerId))
		{
			$query->where(
				$db->quoteName('extensions.created_by') . ' = '
				. (int) $developerId
			);
		}

		$reviewer = $this->getState('filter.reviewer');

		if (is_numeric($reviewer))
		{
			$query->where(
				$db->quoteName('tickets.created_by') . ' = ' . (int) $reviewer
			);
		}

		$ordering = $this->state->get('list.fullordering', 'tickets.id DESC');
		$query->order($db->escape($ordering));

		return $query;
	}
}
