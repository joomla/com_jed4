<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Field;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;

/**
 * List of Developers.
 *
 * @package  JED
 * @since    4.0.0
 */
class DevelopersField extends ListField
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Developers';

	/**
	 * Build a list of Developers.
	 *
	 * @return  array  List of Developers.
	 *
	 * @since   4.0.0
	 *
	 * @throws  \RuntimeException
	 */
	public function getOptions(): array
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'extensions.created_by',
						'username',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions', 'extensions'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('extensions.created_by')
			)
			->group($db->quoteName('extensions.created_by'))
			->order($db->quoteName('username'));
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
