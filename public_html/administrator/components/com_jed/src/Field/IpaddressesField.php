<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Field;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;

use function defined;

/**
 * List of IP addresses.
 *
 * @package  JED
 * @since    4.0.0
 */
class IpaddressesField extends ListField
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Ipaddresses';

	/**
	 * Build a list of IP addresses.
	 *
	 * @return  array  List of IP addresses.
	 *
	 * @throws  \RuntimeException
	 * @since   4.0.0
	 */
	public function getOptions(): array
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'ipAddress',
						'ipAddress',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_reviews'))
			->group($db->quoteName('ipAddress'))
			->order($db->quoteName('ipAddress'));
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
