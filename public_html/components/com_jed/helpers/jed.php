<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

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
	 * Function to decode Compatibility JSON string to an array of Compatibility version
	 *
	 * @param   string|null  $compatibilityJson  The json string
	 *
	 * @return  array   An array of version compatibility
	 *
	 * @since   4.0.0
	 */
	static public function formatCompatibility($compatibilityJson): array
	{
		$jedConfig           = ComponentHelper::getComponent('com_jed')->getParams();
		$compatibility       = json_decode($compatibilityJson);
		$formatCompatibility = [];

		if (!$compatibility)
		{
			return $formatCompatibility;
		}

		// Get Joomla versions from config
		$joomlaVersions       = $jedConfig->get('joomla_versions');
		$joomlaVersionsOutput = [];

		// Format versions with values / names
		foreach ($joomlaVersions as $joomlaVersion)
		{
			$joomlaVersionsOutput[$joomlaVersion->code] = $joomlaVersion->name;
		}

		// Convert to compatibility array for rendering
		foreach ($compatibility as $k => $version)
		{
			$formatCompatibility[$k] = $joomlaVersionsOutput[$version];
		}

		return $formatCompatibility;
	}

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
		if ($size == 'small')
		{
			$imageSize = str_replace('.', '_resizeDown400px175px16.', $filename);
		}

		// Filename for large image
		if ($size == 'large')
		{
			$imageSize = str_replace('.', '_resizeDown1200px525px16.', $filename);
		}

		// Use CDN url
		$imageUrl = 'https://extensionscdn.joomla.org/cache/fab_image/' . $imageSize;

		return $imageUrl;
	}
}
