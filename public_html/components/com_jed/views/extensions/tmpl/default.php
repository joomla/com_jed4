<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;

defined('_JEXEC') or die;

/** @var JedViewExtensions $this */

HTMLHelper::_('script', 'com_jed/jed.js', ['version' => 'auto', 'relative' => true]);

Factory::getDocument()->addScriptDeclaration(<<<JS
    jed.searchForm();
JS
);
?>

<div class="jed-cards-wrapper margin-bottom-half">
	<div class="jed-container">
		<h2 class="heading heading--m">Extensions</h2>
		<ul class="jed-grid jed-grid--1-1-1">
			<?php foreach ($this->items as $item): ?>
				<?php echo LayoutHelper::render('cards.extension', [
					'image'         => $item->image,
					'title'         => $item->title,
					'developer'     => $item->developer,
					'score'         => $item->score,
					'reviews'       => $item->reviews,
					'compatibility' => $item->compatibility,
					'description'   => $item->intro,
					'type'          => $item->type,
					'category'      => $item->category,
					'link'          => Route::_('index.php?option=com_jed&view=extension&id=' . $item->id)
				]); ?>
			<?php endforeach; ?>
		</ul>
	</div>
</div>


<?php echo $this->pagination->getPaginationLinks(); ?>
<!--Hide for now-->
<div style="display: none;">
	<form action="<?php echo Route::_('index.php?option=com_jed&view=extensions'); ?>" id="extensionForm" name="extensionForm" method="post">
		<?php echo $this->filterForm->renderFieldset('filter'); ?>
		<button type="submit"><?php echo Text::_('COM_JED_FORM_SEARCH'); ?></button>
		<button type="button" class="js-extensionsForm-button-reset"><?php echo Text::_('COM_JED_FORM_RESET'); ?></button>
	</form>
</div>