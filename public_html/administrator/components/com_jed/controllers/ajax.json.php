<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Response\JsonResponse;

/**
 * JED AJAX controller.
 *
 * @package   JED
 * @since     4.0.0
 */
class JedControllerAjax extends BaseController
{
	/**
	 * Search for developers.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function developers(): void
	{
		$search = $this->input->getString('query');
		/** @var JedModelExtensions $model */
		$model = $this->getModel('Extensions', 'JedModel');
		$data = $model->getDevelopers($search);

		echo json_encode(['suggestions' => $data]);
	}
}
