<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Model;

\defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\ListModel;

/**
 * JED Extensions Model
 *
 * @package  JED
 * @since    4.0.0
 */
class ExtensionsModel extends ListModel
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
				'category_id',
				'published',
				'approved',
				'developer',
				'user_id',
				'type',
				'includes',
				'extensions.published',
				'extensions.approved',
				'extensions.title',
				'categories.title',
				'extensions.modified_on',
				'extensions.created_on',
				'users.name',
				'extensions.type',
				'extensions.reviewcount',
				'extensions.id',
			];
		}

		parent::__construct($config);
	}

	/**
	 * Method to get an array of data items.
	 *
	 * @return  mixed  An array of data items on success, false on failure.
	 *
	 * @since   4.0.0
	 */
	public function getItems()
	{
		$items = parent::getItems();

		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select('COUNT(' . $db->quoteName('id') . ')')
			->from($db->quoteName('#__jed_reviews'));

		array_walk($items,
			static function ($item) use ($db, $query) {
				// Get the number of reviews
				$query->clear('where')
					->where($db->quoteName('extension_id') . ' = ' . (int) $item->id);
				$db->setQuery($query);
				$item->reviewCount = $db->loadResult();
			}
		);

		return $items;
	}

	/**
	 * Retrieve a list of developers matching a search query.
	 *
	 * @param   string  $search  The string to filter on
	 *
	 * @return  array List of developers.
	 *
	 * @since   4.0.0
	 */
	public function getDevelopers(string $search): array
	{
		$db    = $this->getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'users.id',
						'users.name'
					]
				)
			)
			->from($db->quoteName('#__users', 'users'))
			->leftJoin(
				$db->quoteName('#__jed_extensions', 'extensions')
				. ' ON ' . $db->quoteName('extensions.created_by') . ' = ' . $db->quoteName('users.id')
			)
			->where($db->quoteName('users.name') . ' LIKE ' . $db->quote('%' . $search . '%'))
			->group($db->quoteName('users.id'))
			->order($db->quoteName('users.name'));
		$db->setQuery($query);

		return $db->loadObjectList();
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * This method should only be called once per instantiation and is designed
	 * to be called on the first call to the getState() method unless the model
	 * configuration flag to ignore the request is set.
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
	protected function populateState($ordering = null, $direction = null): void
	{
		if ($ordering === null)
		{
			$ordering = 'extensions.created_on';
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
	protected function getStoreId($id = ''): string
	{
		// Compile the store id.
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . $this->getState('filter.published');

		return parent::getStoreId($id);
	}

	/**
	 * Method to get a \JDatabaseQuery object for retrieving the data set from a database.
	 *
	 * @return  \JDatabaseQuery  A \JDatabaseQuery object to retrieve the data set.
	 *
	 * @since   4.0.0
	 */
	protected function getListQuery(): \JDatabaseQuery
	{
		$db = $this->getDbo();

		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'extensions.id',
						'extensions.title',
						'extensions.alias',
						'extensions.created_by',
						'extensions.modified_on',
						'extensions.created_on',
						'extensions.checked_out',
						'extensions.checked_out_time',
						'extensions.approved',
						'extensions.published',
						'extensions.type',
						'categories.title',
						'users.name',
						'staff.name',
					],
					[
						'id',
						'title',
						'alias',
						'created_by',
						'modified_on',
						'created_on',
						'checked_out',
						'checked_out_time',
						'approved',
						'published',
						'type',
						'category',
						'developer',
						'editor'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions', 'extensions'))
			->leftJoin(
				$db->quoteName('#__categories', 'categories')
				. ' ON ' . $db->quoteName('categories.id') . ' = ' . $db->quoteName('extensions.category_id')
			)
			->leftJoin(
				$db->quoteName('#__jed_extensions_types', 'types')
				. ' ON ' . $db->quoteName('types.extension_id') . ' = ' . $db->quoteName('extensions.id')
			)
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('extensions.created_by')
			)
			->leftJoin(
				$db->quoteName('#__users', 'staff')
				. ' ON ' . $db->quoteName('staff.id') . ' = ' . $db->quoteName('extensions.checked_out')
			);

		// Filter by search in id
		$search = $this->getState('filter.search');

		if (!empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where('extensions.id = ' . (int) substr($search, 3));
			}
			else
			{
				$search = $db->quote('%' . $db->escape($search, true) . '%');
				$query->where($db->quoteName('extensions.title') . ' LIKE ' . $search);
			}
		}

		$categoryIds = $this->getState('filter.category_id');

		if ($categoryIds)
		{
			$query->where($db->quoteName('extensions.category_id') . ' IN (' . implode(',', $categoryIds) . ')');
		}

		$published = $this->getState('filter.published');

		if (is_numeric($published))
		{
			$query->where($db->quoteName('extensions.published') . ' = ' . (int) $published);
		}

		$approved = $this->getState('filter.approved', '');

		if ($approved !== '')
		{
			$query->where($db->quoteName('extensions.approved') . ' = ' . $db->quote($approved));
		}

		$developerId = $this->getState('filter.developer_id');

		if (is_numeric($developerId))
		{
			$query->where($db->quoteName('extensions.created_by') . ' = ' . (int) $developerId);
		}

		$type = $this->getState('filter.type');

		if ($type)
		{
			$query->where($db->quoteName('extensions.type') . ' = ' . $db->quote($type));
		}

		$includes = $this->getState('filter.includes');

		if ($includes && $includes[0] !== '')
		{
			$query->where($db->quoteName('types.type') . ' IN (' . implode(',', $db->quote($includes, false)) . ')');
		}

		// Group by ID to ensure unique results
		$query->group($db->quoteName('extensions.id'));

		// Add the list ordering clause.
		$query->order(
			$db->quoteName(
				$db->escape(
					$this->getState('list.ordering', 'extensions.id')
				)
			) . ' ' . $db->escape($this->getState('list.direction', 'DESC'))
		);

		return $query;
	}

}
