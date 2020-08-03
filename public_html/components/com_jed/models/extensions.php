<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\Utilities\ArrayHelper;

/**
 * Extensions model.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedModelExtensions extends ListModel
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
				'search',
				'category',
				'includes',
				'compatibility',
				'type',
				'hasDemo',
				'newUpdated',
				'score',
				'favourites'
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
						'extensions.id',
						'extensions.title',
						'extensions.intro',
						'extensions.body',
						'extensions.logo',
						'extensions.numReviews',
						'extensions.score',
						'extensions.versions',
						'extensions.type',
						'users.name',
						'categories.title'
					],
					[
						'id',
						'title',
						'intro',
						'body',
						'image',
						'reviews',
						'score',
						'compatibility',
						'type',
						'developer',
						'category',
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
			)
			->where($db->quoteName('extensions.published') . ' = 1');

		$search = $this->getState('filter.search');

		if ($search)
		{
			$search = $db->quote('%' . $search . '%');

			$query->andWhere(
				[
					$db->quoteName('extensions.title') . ' LIKE ' . $search,
					$db->quoteName('extensions.intro') . ' LIKE ' . $search,
				]
			);
		}

		// @todo integrate filters

		$category = $this->getState('filter.category');

		if ($category)
		{
			$query->where('extensions.category_id = ' . (int) $category);
		}

		$extensionId = $this->getState('filter.extensionId');

		if (is_numeric($extensionId))
		{
			$type = $this->getState('filter.extensionId.include', true) ? '= ' : '<> ';
			$query->where('extensions.id ' . $type . (int) $extensionId);
		}
		elseif (is_array($extensionId))
		{
			$extensionId = ArrayHelper::toInteger($extensionId);
			$extensionId = implode(',', $extensionId);
			$type        = $this->getState('filter.extensionId.include', true) ? 'IN' : 'NOT IN';
			$query->where('extensions.id ' . $type . ' (' . $extensionId . ')');
		}

		$compatibility = $this->getState('filter.compatibility');

		if ($compatibility)
		{

		}

		$type = $this->getState('filter.type');

		if ($type)
		{

		}

		$hasDemo = $this->getState('filter.hasDemo');

		if ($hasDemo)
		{

		}

		$newUpdated = $this->getState('filter.newUpdated');

		if ($newUpdated)
		{

		}

		$score = $this->getState('filter.score');

		if ($score)
		{
			$query->where($db->quoteName('extensions.overallscore') . ' > ' . (int) $score);
		}

		$favourites = $this->getState('filter.favourites');

		if ($favourites)
		{

		}

		$developer = $this->getState('filter.developer');

		if ($developer)
		{
			$query->where($db->quoteName('extensions.created_by') . ' = ' . (int) $developer);
		}

		$query->order($this->getState('list.ordering', 'extensions.ordering') . ' ' . $this->getState('list.direction', 'ASC'));

		return $query;
	}

	/**
	 * Override parent getItems to prepare data for display
	 *
	 * @return  array
	 *
	 * @since   4.0.0
	 */
	public function getItems()
	{
		$items = parent::getItems();

		// Prepare the extensions data for display
		foreach ($items as $item)
		{
			// Legacy support to make sure we have an intro
			if (!$item->intro)
			{
				$item->intro = HTMLHelper::_('string.truncate', $item->body, 150, true, false);
			}

			unset($item->body);

			// Format the image
			$item->image = JedHelper::formatImage($item->image, 'small');

			// Make array of compatibility @TODO: get data from joined table
			$item->compatibility = '';

			// First character of type uppercase
			$item->type = ucfirst($item->type);
		}

		return $items;
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
			$ordering = 'extensions.ordering';
		}

		if ($direction === null)
		{
			$direction = 'ASC';
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
		$id .= ':' . $this->getState('filter.search');
		$id .= ':' . json_encode($this->getState('filter.category'));
		$id .= ':' . serialize($this->getState('filter.extensionId'));
		$id .= ':' . $this->getState('filter.extensionId.include');
		$id .= ':' . $this->getState('filter.compatibility');
		$id .= ':' . $this->getState('filter.type');
		$id .= ':' . $this->getState('filter.hasDemo');
		$id .= ':' . $this->getState('filter.newUpdated');
		$id .= ':' . $this->getState('filter.score');
		$id .= ':' . $this->getState('filter.favourites');
		$id .= ':' . $this->getState('filter.developer');

		return parent::getStoreId($id);
	}
}
