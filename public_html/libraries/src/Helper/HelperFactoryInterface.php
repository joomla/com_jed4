<?php
/**
 * Joomla! Content Management System
 *
 * @copyright  (C) 2021 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Helper;

\defined('JPATH_PLATFORM') or die;

/**
 * Factory to load helper classes.
 *
 * @since  __DEPLOY_VERSION__
 */
interface HelperFactoryInterface
{
	/**
	 * Returns a helper instance for the given name.
	 *
	 * @param   string  $name    The name
	 * @param   array   $config  The config
	 *
	 * @return  \stdClass
	 *
	 * @since   __DEPLOY_VERSION__
	 */
	public function getHelper(string $name, array $config = []);
}
