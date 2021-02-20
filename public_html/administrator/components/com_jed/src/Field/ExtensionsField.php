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
 * List of Extensions.
 *
 * @package  JED
 * @since    4.0.0
 */
class ExtensionsField extends ListField
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Extensions';

	/**
	 * Build a list of Extensions.
	 *
	 * @return  array  List of Extensions.
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
						'id',
						'title',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions'))
			->group($db->quoteName('id'))
			->order($db->quoteName('title'));
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
