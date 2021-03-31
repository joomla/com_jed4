<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

namespace Jed\Component\Jed\Site\Helper;
use Joomla\CMS\Component\ComponentHelper;

/**
 * JED Helper
 *
 * @package   JED
 * @since     4.0.0
 */
class JedHelper
{
	/**
	 * Function to format JED Extension Images
	 *
	 * @param   string  $filename  The image filename
	 * @param   string  $size      Size of image, small|large
	 *
	 * @return  string  Full image url
	 *
	 * @since   4.0.0
	 */
	static public function formatImage($filename, $size = 'small'): string
	{
		if (!$filename)
		{
			return '';
		}

		// Filename for small image
		if ($size === 'small')
		{
			$imageSize = str_replace('.', '_resizeDown400px175px16.', $filename);
		}

		// Filename for large image
		if ($size === 'large')
		{
			$imageSize = str_replace('.', '_resizeDown1200px525px16.', $filename);
		}

		// Use CDN url
		return 'https://extensionscdn.joomla.org/cache/fab_image/' . $imageSize;
	}
}
