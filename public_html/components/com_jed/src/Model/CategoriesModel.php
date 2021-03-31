<?php
/**
 * @package       JED
 *
 * @subpackage    Categories
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Site\Model;
// No direct access.
\defined('_JEXEC') or die;

use Joomla\CMS\Categories\Categories;
use Joomla\CMS\Categories\CategoryNode;
use Joomla\CMS\MVC\Model\ListModel;
use Joomla\Utilities\ArrayHelper;


/**
 * Methods supporting a list of Category records.
 *
 * @since  3.0
 */
class CategoriesModel extends ListModel
{
	/**
	 * Constructor.
	 *
	 * @param   array  $config  An optional associative array of configuration settings.
	 *
	 * @since      1.6
	 * @see        JController
	 */
	public $_context = 'com_jed.categories';
	protected $_extension = 'com_jed';

	/**
	 * Parent category of the current one
	 *
	 * @since 3.0
	 * @var    CategoryNode|null
	 *
	 */
	private $_parent = null;

	public function __construct($config = array())
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = [
				'search',
				'category',
				'parentId'
			];

		}

		parent::__construct($config);
	}


	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @param   string  $ordering   Elements order
	 * @param   string  $direction  Order direction
	 *
	 * @return void
	 *
	 * @since    1.6
	 * @throws Exception
	 *
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		if ($ordering === null)
		{
			$ordering = 'categories.ordering';
		}

		if ($direction === null)
		{
			$direction = 'ASC';
		}

		parent::populateState($ordering, $direction);
	}


	/**
	 * Get the parent.
	 *
	 * @return  object  An array of data items on success, false on failure.
	 *
	 * @since   3.0
	 */
	public function getParent()
	{
		if (!is_object($this->_parent))
		{
			$this->getItems();
		}

		return $this->_parent;
	}


	/**
	 * Build query and where for protected _getList function and return a list
	 *
	 * @param   int   $limitStart  Where to start looking up records
	 * @param   int   $limit       Number of records to return, set to -1 to return all records
	 * @param   bool  $extended    Extend the data with links etc, default true
	 *
	 * @return array An array of results.
	 *
	 * @since 3.0
	 */
	public function getItems($limitStart = null, $limit = null, $extended = true)
	{


		if (isset($this->items))
		{
			return $this->items;
		}
		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		$options               = [];
		$options['extension']  = 'com_jed';
		$options['table']      = '#__jed_extensions';
		$options['countItems'] = 0;
		$options['statefield'] = 'approved';
		$options['access']     = false;

		$recursive  = false;
		$categories = Categories::getInstance('Jed', $options);

		$this->parent = $categories->get($this->getState('filter.parentId', 'root'));

		if (is_object($this->parent))
		{
			$this->items = $this->parent->getChildren($recursive);
		}
		else
		{
			$this->items = [];
		}

		// Get counts - cant do it in the JCategories list as it doesnt count the category totals
		$query->select('category_id, COUNT(id) AS c')
			->from('#__jed_extensions AS e')
			->where('e.approved = 1')
			->group('e.category_id');
		$db->setQuery($query);

		$counts = $db->loadObjectList('category_id');

		$null    = new \stdClass;
		$null->c = 0;
		$list    = [];

		$this->total = 0;

		foreach ($this->items as $item)
		{
			$row           = $this->nodeToObject($item);
			$row->numitems = ArrayHelper::getValue($counts, $row->id, $null)->c;
			$children      = $item->getChildren();
			$parentCount   = 0;

			foreach ($children as $child)
			{
				$i                        = $this->nodeToObject($child);
				$i->numitems              = ArrayHelper::getValue($counts, $i->id, $null)->c;
				$row->children[$i->title] = $i;
				$parentCount              += $i->numitems;
				$this->total              += $i->numitems;
			}

			ksort($row->children);
			$row->parent_numitems = $row->numitems;
			$row->child_numitems  = $parentCount;
			$row->numitems        = $row->numitems + $parentCount;

			$list[$row->title] = $row;
		}

		ksort($list, SORT_NATURAL | SORT_FLAG_CASE);
		$list = array_values($list);


		$this->items = $this->preProcess($list);

		return $this->items;
	}

	/**
	 * Convert an node to an object
	 *
	 * @param   object  $item  XML node
	 *
	 * @return stdClass
	 *
	 * @since 3.0
	 */
	private function nodeToObject($item)
	{
		$row            = new \stdClass;
		$row->extension = $item->extension;
		$row->title     = $item->title;
		$row->alias     = $item->alias;
		$row->slug      = $item->slug;
		$row->parent_id = $item->parent_id;
		$row->id        = $item->id;
		$row->icon      = $this->setIcon($item->alias);
		$row->children  = [];

		return $row;
	}

	/**
	 * Get total number of rows for pagination
	 *
	 * @return  int  Total number of records
	 *
	 * @since 3.0
	 */
	public function getTotal()
	{


		if (empty($this->total))
		{
			$this->total = count($this->Items());
		}

		return $this->total;
	}

	protected function preProcess($items)
	{
		$result       = array();
		$secondChance = array();
		$adCount      = 0;

		// Sort by numitems
		usort($items, function ($item1, $item2) {
			return ((int) $item1->numitems) < ((int) $item2->numitems);
		});

		// Removing Extension Specific ... it goes to the second chance
		$extensionSpecific           = array_shift($items);
		$extensionSpecific->children = [];
		$secondChance[]              = $extensionSpecific;

		foreach ($items as $parent)
		{
			// No small categories
			if (count($parent->children) < 6)
			{
				$parent->children = [];
				$secondChance[]   = $parent;

				continue;
			}

			$sortedChildren = $parent->children;
			usort($sortedChildren, function ($item1, $item2) {
				return ((int) $item1->numitems) < ((int) $item2->numitems);
			});

			if ((count($parent->children) <= 9))
			{
				$parent->children = $sortedChildren;
				$result[]         = $parent;
			}
			else
			{
				$newChildren = array();
				$j           = 0;

				foreach ($sortedChildren as $child)
				{
					// Cleaning empty
					if ($child->numitems == 0)
					{
						continue;
					}

					if ($j < 9)
					{
						$newChildren[$j] = $child;
					}
					else
					{
						$readMore            = new \StdClass;
						$readMore->title     = 'View All';
						$readMore->alias     = $parent->alias->value;
						$readMore->slug      = $parent->slug;
						$readMore->parent_id = $parent->parent_id->value;
						$readMore->id        = $parent->id->value;
						$readMore->children  = array();
						$readMore->numitems  = 0;
						$newChildren[$j]     = $readMore;

						break;
					}

					$j++;
				}

				$newParent           = clone $parent;
				$newParent->children = $newChildren;
				$result[]            = $newParent;
			}

			//	$adCount++;
			//	$this->addAdd($result, $adCount);
		}

		// Second chance at the end of the list
		foreach ($secondChance as $item)
		{
			$result[] = $item;
		}

		return $result;
	}

	function setIcon(string $alias): string
	{
		$icon = '';
		switch ($alias)
		{
			case 'administration';
				$icon = 'key';
				break;
			case 'access-a-security':
				$icon = 'lock';
				break;
			case 'financial':
				$icon = 'eur';
				break;
			case 'communication':
				$icon = 'comment';
				break;
			case 'directory-a-documentation':
				$icon = 'book';
				break;
			case 'multimedia':
				$icon = 'video-camera';
				break;
			case 'ads-a-affiliates':
				$icon = 'envelope';
				break;
			case 'core-enhancements':
				$icon = 'puzzle-piece';
				break;
			case 'e-commerce':
				$icon = 'shopping-cart';
				break;
			case 'search-a-indexing':
				$icon = 'search';
				break;
			case 'news-display':
				$icon = 'exclamation-circle';
				break;
			case 'calendars-a-events':
				$icon = 'calendar';
				break;
			case 'miscellaneous':
				$icon = 'coffee';
				break;
			case 'extension-specific':
				$icon = 'cubes';
				break;
			case 'vertical-markets':
				$icon = 'cutlery';
				break;
			case 'style-a-design':
				$icon = 'paint-brush';
				break;
			case 'editing':
				$icon = 'edit';
				break;
			case 'mobile':
				$icon = 'mobile';
				break;
			case 'sports-a-games':
				$icon = 'futbol-o';
				break;
			case 'site-management':
				$icon = 'html5';
				break;
			case 'hosting-a-servers':
				$icon = 'hdd-o';
				break;
			case 'contacts-a-feedback':
				$icon = 'comments';
				break;
			case 'photos-a-images':
				$icon = 'camera';
				break;
			case 'authoring-a-content':
				$icon = 'file';
				break;
			case 'clients-a-communities':
				$icon = 'users';
				break;
			case 'structure-a-navigation':
				$icon = 'sitemap';
				break;
			case 'migration-a-conversion':
				$icon = 'rocket';
				break;
			case 'content-sharing':
				$icon = 'share-alt';
				break;
			case 'social-web':
				$icon = 'thumbs-up';
				break;
			case 'maps-a-weather':
				$icon = 'location-arrow';
				break;
			case 'living':
				$icon = 'child';
				break;
			case 'marketing':
				$icon = 'line-chart	';
				break;
			case 'languages':
				$icon = 'globe';
				break;
			case 'official-extensions':
				$icon = 'joomla';
				break;
			default:
				$icon = 'times';
				break;
		}

		return $icon;
	}
}
