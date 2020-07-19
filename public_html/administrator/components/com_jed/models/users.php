<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\ListModel;
use Joomla\CMS\Table\Table;

/**
 * JED Users Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelUsers extends ListModel
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
				'name',
				'username',
				'developerName',

				'users.id',
				'users.name',
				'users.username',
				'users.registerDate',
				'users.lastvisitDate',
				'jed_users.developerName',
				'publishedExtensions',
				'publishedReviews',
			];
		}

		parent::__construct($config);
	}

	/**
	 * Returns a reference to the a Table object, always creating it.
	 *
	 * @param   string  $type    The table type to instantiate
	 * @param   string  $prefix  A prefix for the table class name. Optional.
	 * @param   array   $config  Configuration array for model. Optional.
	 *
	 * @return  Table  A database object
	 * @since   4.0.0
	 */
	public function getTable($type = 'Users', $prefix = 'JedTable', $config = array())
	{
		return Table::getInstance($type, $prefix, $config);
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
			$ordering = 'users.username';
		}

		if ($direction === null)
		{
			$direction = 'ASC';
		}

		// List state information.
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
		// Compile the store id.
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.access');
		$id .= ':' . $this->getState('filter.published');

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

		$query->select($db->quoteName(
			[
				'users.id',
				'users.name',
				'users.username',
				'users.registerDate',
				'users.lastvisitDate',
				'jed_users.developerName',
			],
			[
				'id',
				'name',
				'username',
				'registerDate',
				'lastvisitDate',
				'developerName',
			]
		))
			->select('COUNT(extensions.id) AS publishedExtensions')
			->select('COUNT(reviews.id) AS publishedReviews')
			->from($db->quoteName('#__jed_users', 'jed_users'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('jed_users.id') . ' = ' . $db->quoteName('users.id')
			)
			->leftJoin(
				$db->quoteName('#__jed_extensions', 'extensions')
				. ' ON ' . $db->quoteName('jed_users.id') . ' = ' . $db->quoteName('extensions.created_by')
				. ' AND ' . $db->quoteName('extensions.published') . ' = 1'
				. ' AND ' . $db->quoteName('extensions.approved') . ' = 1'
			)
			->leftJoin(
				$db->quoteName('#__jed_reviews', 'reviews')
				. ' ON ' . $db->quoteName('jed_users.id') . ' = ' . $db->quoteName('reviews.created_by')
				. ' AND ' . $db->quoteName('reviews.published') . ' = 1'
			);


		$search = $this->getState('filter.search');

		if (!empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where($db->quoteName('jed_users.id') . ' = ' . (int) substr($search, 3));
			}
			else
			{
				$search = $db->quote('%' . $db->escape($search, true) . '%');
				$query->where($db->quoteName('users.name') . ' LIKE ' . $search)
					->orWhere($db->quoteName('users.username') . ' LIKE ' . $search)
					->orWhere($db->quoteName('jed_users.developerName') . ' LIKE ' . $search);
			}
		}

		$query->group($db->quoteName('jed_users.id'));

		$ordering = $this->state->get('list.fullordering', 'jed_users.id DESC');
		$query->order($db->escape($ordering));

		return $query;
	}
}
