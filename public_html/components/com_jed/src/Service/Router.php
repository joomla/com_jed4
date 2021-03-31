<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

namespace Jed\Component\Jed\Site\Service;

use Joomla\CMS\Component\Router\RouterBase;
use Joomla\CMS\Factory;

/**
 * JED Router.
 *
 * @package   JED
 * @since     4.0.0
 */
class Router extends RouterBase
{
	/**
	 * Build the route for the com_jed component
	 *
	 * @param   array  $query  An array of URL arguments
	 *
	 * @return  array   The URL arguments to use to assemble the subsequent URL.
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function build(&$query): array
	{
		$segments = [];
		$link     = '';

		if (!isset($query['view'], $query['id']) && isset($query['Itemid']))
		{
			// Get  information from the Itemid.
			$link = Factory::getApplication()->getMenu()->getItem($query['Itemid'])->link;
		}

		$matches = array();

		// Check for view
		if (!isset($query['view']))
		{
			preg_match('/view=([a-z,A-z,0-9]*)/', $link, $matches);

			$view = $matches[1] ?? null;
		}
		else
		{
			$view = $query['view'];
		}

		// Check for id
		if (!isset($query['id']))
		{
			preg_match('/id=([a-z,A-z,0-9]*)/', $link, $matches);

			$id = $matches[1] ?? null;
		}
		else
		{
			$id = (int) $query['id'];
		}

		unset($query['view'], $query['id']);

		$db = Factory::getDbo();

		switch ($view)
		{
			case 'extension':
				$query['Itemid'] = $this->getItemid('extensions');

				if($id)
				{
					$dbQuery = $db->getQuery(true)
						->select($db->quoteName('alias'))
						->from($db->quoteName('#__jed_extensions'))
						->where($db->quoteName('id') . ' = ' . $id);

					$segments[] = $db->setQuery($dbQuery)->loadResult();
				}
				unset($query['id']);

				break;

			default:
				$query['Itemid'] = $this->getItemid($view);
				break;
		}

		return $segments;
	}

	/**
	 * Parse the segments of a URL.
	 *
	 * @param   array   $segments   The segments of the URL to parse.
	 *
	 * @return  array   The URL attributes to be used by the application.
	 * @since   4.0.0
	 */
	public function parse(&$segments): array
	{
		$vars = array();

		// Get the active menu item.
		$item = $this->menu->getActive();

		// Count route segments
		$count = count($segments);

		if (!$count)
		{
			return $vars;
		}

		// Database
		$db = Factory::getDbo();

		// View
		$view = isset($item->query['view']) ? $item->query['view'] : 'home';

		// Handle the View
		switch ($view)
		{
			case 'extensions':
				if ($segments[0])
				{
					$vars['view'] = 'extension';

					$dbQuery = $db->getQuery(true)
						->select($db->quoteName('id'))
						->from($db->quoteName('#__jed_extensions'))
						->where($db->quoteName('alias') . ' = ' . $db->quote($segments[0]));

					$vars['id'] = $db->setQuery($dbQuery)->loadResult();
				}
				break;
		}

		return $vars;
	}

	/**
	 * Find an Itemid for a given combination for view and id. This will resolve to a parent menu item with only view
	 * if the there is no item with view and id.
	 *
	 * @param   string  $view   The view to search for
	 * @param   int     $id     An optional id to find in conjunction with the view
	 *
	 * @return  integer|null    The Itemid that corresponds most to the requested view/id
	 *
	 * @since   4.0.0
	 */
	private function getItemid($view, $id = null)
	{
		$items = $this->menu->getItems('component', 'com_jed');

		if ($id)
		{
			foreach ($items as $item)
			{
				if (isset($item->query['view'], $item->query['id'])
					&& $item->query['view'] === $view && $item->query['id'] === $id
				)
				{
					return $item->id;
				}
			}
		}

		foreach ($items as $item)
		{
			if (isset($item->query['view']) && $item->query['view'] === $view)
			{
				return $item->id;
			}
		}

		return null;
	}
}
