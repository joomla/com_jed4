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
 * Reviews model.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedModelReviews extends ListModel
{
	/**
	 * Constructor.
	 *
	 * @param   array  $config  An optional associative array of configuration settings.
	 *
	 * @see     BaseDatabaseModel
	 *
	 * @since   4.0.0
	 */
	public function __construct($config = [])
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = [
				'extension'
			];
		}

		parent::__construct($config);
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
		$db    = $this->getDbo();
		$query = parent::getListQuery()
			->select(
				$db->quoteName(
					[
						'reviews.id',
						'reviews.created_date'
					]
				)
			)
			->from($db->quoteName('#__jed_reviews', 'reviews'))
			->where($db->quoteName('reviews.state') . ' = 1');

		$extensionId = $this->getState('filter.extension');

		if (is_numeric($extensionId))
		{
			$query->where($db->quoteName('reviews.extensionid') . ' = ' . (int) $extensionId);
		}

		// Handle the list ordering.
		$ordering  = $this->getState('list.ordering');
		$direction = $this->getState('list.direction');

		if (!empty($ordering))
		{
			$query->order($db->escape($ordering) . ' ' . $db->escape($direction));
		}

		return $query;
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
			$ordering = 'reviews.created_date';
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
	 * @return  string        A store id.
	 * @since   4.0.0
	 */
	protected function getStoreId($id = ''): string
	{
		$id .= ':' . $this->getState('filter.extension');

		return parent::getStoreId($id);
	}
}
