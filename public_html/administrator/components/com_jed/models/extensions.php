<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\ListModel;

/**
 * JED Extensions Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelExtensions extends ListModel
{
	/**
	 * Constructor.
	 *
	 * @param   array  $config  An optional associative array of configuration settings.
	 *
	 * @see     ListModel
	 * @since   4.0.0
	 */
	public function __construct($config = array())
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = array(
				'id', 't.id',
				'title', 't.title',
				'category', 't.category',
				'published', 't.published',
				'approved', 't.approved',
				'developer', 't.developer',
				'type', 't.type',
				'reviewCount', 't.reviewCount',

			);
		}

		parent::__construct($config);
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
		$id .= ':' . $this->getState('filter.access');
		$id .= ':' . $this->getState('filter.state');

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
						'extensions.created_by',
						'extensions.approved',
						'extensions.published',
						'extensions.type',
						'categories.title',
						'users.name',
					],
					[
						'id',
						'name',
						'created_by',
						'approved',
						'published',
						'type',
						'category',
						'developer'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions', 'extensions'))
			->leftJoin(
				$db->quoteName('#__categories', 'categories')
				. ' ON ' . $db->quoteName('categories.id') . ' = ' . $db->quoteName('extensions.category_id')
			)
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('extensions.created_by')
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
				$query->where($db->quoteName('extensions.id') . ' LIKE ' . $search);
			}
		}

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

		$db = $this->getDbo();
		$query = $db->getQuery(true)
			->select('COUNT(' . $db->quoteName('id') . ')')
			->from($db->quoteName('#__jed_reviews'));

		array_walk($items,
			static function ($item) use ($db, $query)
			{
				// Get the number of reviews
				$query->clear('where')
					->where($db->quoteName('extension_id') . ' = ' . (int) $item->id);
				$db->setQuery($query);
				$item->reviewCount = $db->loadResult();
			}
		);

		return $items;
	}


}
