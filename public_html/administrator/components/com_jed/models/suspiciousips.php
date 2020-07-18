<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Table\Table;

/**
 * Jed Suspiciousips Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelSuspiciousips extends ListModel
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
				'published'
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
		// Load the filter state.
		$search = $this->getUserStateFromRequest(
			$this->context . '.filter.search', 'filter_search'
		);
		$this->setState('filter.search', $search);

		$accessId = $this->getUserStateFromRequest(
			$this->context . '.filter.access', 'filter_access', null, 'int'
		);
		$this->setState('filter.access', $accessId);

		$published = $this->getUserStateFromRequest(
			$this->context . '.filter.state', 'filter_state', '', 'string'
		);
		$this->setState('filter.state', $published);

		// Load the parameters.
		$params = ComponentHelper::getParams('com_jed');
		$this->setState('params', $params);

		// List state information.
		parent::populateState('suspiciousips.id', 'asc');
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
		$id .= ':' . $this->getState('filter.access');
		$id .= ':' . $this->getState('filter.state');

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
		// Create a new query object.
		$db = $this->getDbo();

		$query = $db->getQuery(true);

		// Select some fields
		$query->select(
			$db->quoteName(
				[
					'suspiciousips.id',
					'suspiciousips.created',
					'suspiciousips.created_by',
					'suspiciousips.checked_out',
					'suspiciousips.checked_out_time',
					'suspiciousips.published',
					'suspiciousips.reason',
					'suspiciousips.ipaddr',
					'editors.name',
					'users.name'
				],
				[
					'id',
					'created_time',
					'created_by',
					'checked_out',
					'checked_out_time',
					'published',
					'reason',
					'ipaddr',
					'editor',
					'creator'
				]
			)
		);

		$query->from($db->quoteName('#__jed_suspiciousips', 'suspiciousips'))
			->leftJoin($db->quoteName('#__users', 'editors')
				. ' ON ' . $db->quoteName('editors.id') . ' = ' . $db->quoteName('suspiciousips.checked_out')
			)
			->leftJoin($db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('suspiciousips.created_by')
			);

		// Filter by search in id
		$search = $this->getState('filter.search');

		if ( ! empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where('suspiciousips.id = ' . (int) substr($search, 3));
			}
			else
			{
				$search = $db->quote('%' . $db->escape($search, true) . '%');
				$query->where('suspiciousips.ipaddr LIKE ' . $search);
			}
		}

		// Add the list ordering clause.
		$ordering = $this->state->get('list.fullordering', 'id ASC');
		$query->order($db->escape($ordering));

		return $query;
	}
}
