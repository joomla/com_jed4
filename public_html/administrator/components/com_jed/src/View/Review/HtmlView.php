<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\View\Review;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Helper\ContentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Object\CMSObject;
use Joomla\CMS\Toolbar\ToolbarHelper;
use Jed\Component\Jed\Administrator\Model\ReviewModel;
use Joomla\Registry\Registry;
use RuntimeException;

use function defined;

/**
 * View to edit a review.
 *
 * @since  4.0.0
 */
class HtmlView extends BaseHtmlView
{
	/**
	 * Form with settings
	 *
	 * @var    Form
	 * @since  4.0.0
	 */
	protected Form $form;

	/**
	 * The item data.
	 *
	 * @var    CMSObject
	 * @since  4.0.0
	 */
	protected CMSObject $item;

	/**
	 * The model state.
	 *
	 * @var    Registry
	 * @since  4.0.0
	 */
	protected Registry $state;

	/**
	 * Display the view
	 *
	 * @param   string  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function display($tpl = null): void
	{
		/** @var ReviewModel $model */
		$model       = $this->getModel();
		$this->state = $model->getState();
		$this->item  = $model->getItem();
		$this->form  = $model->getForm();
		$errors      = $model->getErrors();

		if ($errors && count($errors))
		{
			throw new RuntimeException(implode("\n", $errors), 500);
		}

		$this->addToolbar();

		parent::display($tpl);
	}

	/**
	 * Add the page title and toolbar.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	protected function addToolbar(): void
	{
		Factory::getApplication()->input->set('hidemainmenu', true);

		ToolBarHelper::title(Text::_('COM_JED_REVIEW_VIEW_EDIT_TITLE'), 'star');

		$canDo = ContentHelper::getActions(
			'com_jed', 'review', $this->state->get('filter.published')
		);

		if ($canDo->get('core.edit.state'))
		{
			ToolbarHelper::apply('review.apply');
			ToolbarHelper::save('review.save');
		}

		if (empty($this->item->get('id')))
		{
			ToolbarHelper::cancel('review.cancel');
		}
		else
		{
			ToolbarHelper::cancel('review.cancel', 'JTOOLBAR_CLOSE');
		}
	}
}
