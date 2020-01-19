<?php

/**
 * @author Daniel Dimitrov - compojoom.com
* @date: 02.06.12
*
* @copyright  Copyright (C) 2008 - 2012 compojoom.com . All rights reserved.
* @license    GNU General Public License version 2 or later; see LICENSE
*
* Hugh Messenger - fabrikar.com - Refactored unzip functions in to helper, to make it easier to drive from CLI
*/

defined('_JEXEC') or die('Restricted access');

jimport('joomla.filesystem');
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.archive');

class jedcheckerHelper
{
	public $archiveTypes = null;

	public $path = null;

	public $pathArchive = null;

	public $pathUnzipped = null;

	public function __construct()
	{
		$this->path = JFactory::getConfig()->get('tmp_path') . '/jed_checker';
		$this->pathArchive = $this->path . '/archives';
		$this->pathUnzipped = $this->path . '/unzipped';
		$this->archiveTypes = array('zip', 'gz', 'gzip');
	}

	public function allowedTypes()
	{
		return $this->$archiveTypes();
	}

	public function isArchiveType($file)
	{
		$parts = pathinfo($file);

		return (in_array(strtolower($parts['extension']), $this->archiveTypes));
	}

	/**
	 * Unzip the file
	 *
	 * @param   string  $file            Filename to unzip
	 * @param   bool    $removeUnzipped  Should previously unzipped files be deleted.
	 *
	 * @return  bool
	 */
	public function unzip($file = '', $removeUnzipped = true)
	{
		// If folder doesn't exist - create it!
		if(!JFolder::exists($this->pathUnzipped))
		{
			JFolder::create($this->pathUnzipped);
		}
		else
		{
			if ($removeUnzipped)
			{
				// Let us remove all previous unzipped files
				$folders = JFolder::folders($this->pathUnzipped);

				foreach ($folders as $folder)
				{
					JFolder::delete($this->pathUnzipped .'/'. $folder);
				}
			}
		}

		if (empty($file))
		{
			$file = JFolder::files($this->pathArchive);
			$file = JArrayHelper::getValue($file, 0, '');
		}

		$result = false;

		if (!empty($file))
		{
			$result = JArchive::extract($this->pathArchive . '/' . $file, $this->pathUnzipped . '/' . $file);

			if ($result)
			{
				// Scan unzipped folders if we find zip file -> unzip them as well
				$this->unzipAll($this->pathUnzipped . '/' . $file);
			}
		}

		return $result;
	}

	/**
	 * Recursively go through each folder and extract the archives
	 *
	 * @param $start
	 */
	public function unzipAll($start)
	{
		$iterator = new RecursiveDirectoryIterator($start);

		foreach ($iterator as $file)
		{
			if ($file->isFile())
			{
				$extension = pathinfo($file->getFilename(), PATHINFO_EXTENSION);;

				if ($extension == 'zip')
				{
					$unzip = $file->getPath() . '/' . $file->getBasename('.' . $extension);
					$result = JArchive::extract($file->getPathname(), $unzip);

					// Delete the archive once we extract it
					if ($result)
					{
						JFile::delete($file->getPathname());

						// Now check the new extracted folder for archive files
						$this->unzipAll($unzip);
					}
				}
			}
			else if (!$iterator->isDot())
			{
				$this->unzipAll($file->getPathname());
			}
		}
	}
}
