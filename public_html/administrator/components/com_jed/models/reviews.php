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
 * JED Reviews Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelReviews extends ListModel
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
				'reviews.published',
				'created_by',
				'reviews.created_by',
				'created_on',
				'reviews.created_on',
				'title',
				'reviews.title',
				'score',
				'reviews.score',
				'developer',
				'users.username',
				'reviewer',
				'users.id',
				'extension',
				'extensions.extension_id',
				'title',
				'extensions.title',
				'ipaddress',
				'reviews.ipAddress',
				'id',
				'reviews.id',
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
	public function getTable($type = 'Reviews', $prefix = 'JedTable', $config = array())
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
			$ordering = 'reviews.id';
		}

		if ($direction === null)
		{
			$direction = 'DESC';
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

		// @TODO calculation for overall_score column
		$query->select($db->quoteName(
			[
				'reviews.published',
				'reviews.id',
				'reviews.title',
				'reviews.created_on',
				'reviews.ipAddress',
				'reviews.flagged',
				'reviews.extension_id',
				'reviews.created_by',
				'users.id',
				'users.username',
				'extensions.title',
				'extensions.created_by',
				'developers.username',
			],
			[
				'published',
				'id',
				'title',
				'created_on',
				'ipAddress',
				'flagged',
				'extensionId',
				'created_by',
				'userId',
				'username',
				'extensionname',
				'developerId',
				'developer',
			]
		))
			->from($db->quoteName('#__jed_reviews', 'reviews'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('reviews.created_by')
			)
			->leftJoin(
				$db->quoteName('#__jed_extensions', 'extensions')
				. ' ON ' . $db->quoteName('extensions.id') . ' = ' . $db->quoteName('reviews.extension_id')
			)
			->leftJoin(
				$db->quoteName('#__users', 'developers')
				. ' ON ' . $db->quoteName('developers.id') . ' = ' . $db->quoteName('extensions.created_by')
			);

		$search = $this->getState('filter.search');

		if (!empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where($db->quoteName('reviews.id') . ' = ' . (int) substr($search, 3));
			}
			else
			{
				$search = $db->quote('%' . $db->escape($search, true) . '%');
				$query->where($db->quoteName('reviews.title') . ' LIKE ' . $search);
			}
		}

		$published = $this->getState('filter.published');
		if (is_numeric($published))
		{
			$query->where($db->quoteName('reviews.published') . ' = ' . (int) $published);
		}

		$extension = $this->getState('filter.extension');
		if (is_numeric($extension))
		{
			$query->where($db->quoteName('reviews.extension_id') . ' = ' . (int) $extension);
		}

		$developer = $this->getState('filter.developer');
		if (is_numeric($developer))
		{
			$query->where($db->quoteName('extensions.created_by') . ' = ' . (int) $developer);
		}

		$reviewer = $this->getState('filter.reviewer');
		if (is_numeric($reviewer))
		{
			$query->where($db->quoteName('reviews.created_by') . ' = ' . (int) $reviewer);
		}

		$ordering = $this->state->get('list.fullordering', 'reviews.id DESC');
		$query->order($db->escape($ordering));

		return $query;
	}
}
