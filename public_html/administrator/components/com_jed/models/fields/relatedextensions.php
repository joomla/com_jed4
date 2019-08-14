<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;

JFormHelper::loadFieldClass('list');

/**
 * List of Related Extensions.
 *
 * @package  JED
 * @since    4.0.0
 */
class JedFormFieldRelatedextensions extends JFormFieldList
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Related extensions';

	/**
	 * Build a list of related xtensions.
	 *
	 * @return  array  List of related extensions.
	 *
	 * @since   4.0.0
	 *
	 * @throws  RuntimeException
	 */
	public function getOptions(): array
	{
		$db    = Factory::getDbo();
		$extensionId = (int) $this->form->getValue('id');
		$joinQuery = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'extensions.id',
						'extensions.title',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions', 'extensions'))
			->innerJoin(
				$db->quoteName('#__jed_extensions_related', 'related')
				. ' ON ' . $db->quoteName('related.related_id') . ' = ' . $db->quoteName('extensions.id')
			)
			->where($db->quoteName('related.extension_id') . ' = ' . $extensionId);

		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'extensions.id',
						'extensions.title',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_extensions', 'extensions'))
			->innerJoin(
				$db->quoteName('#__jed_extensions_related', 'related')
				. ' ON ' . $db->quoteName('related.extension_id') . ' = ' . $db->quoteName('extensions.id')
			)
			->where($db->quoteName('related.related_id') . ' = ' . $extensionId)
			->union($joinQuery);
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
