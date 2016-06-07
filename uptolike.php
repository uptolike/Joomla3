<?php
/**
 * @version     1.0.4
 * @Project     Uptolike Share Buttons
 * @author      UpToLike Team
 * @package
 * @copyright   Copyright (C) 2016 UpToLike.com. All rights reserved.
 * @license     GNU/GPL: http://www.gnu.org/copyleft/gpl.html
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.plugin.plugin');


class plgContentUptolike extends JPlugin {
    private $componentView = null;

    public $jsCode = "
<script type='text/javascript'>(function (w, doc) {
    if (!w.__utlWdgt) {
        w.__utlWdgt = true;
        var d = doc, s = d.createElement('script'), g = 'getElementsByTagName';
        s.type = 'text/javascript';
        s.charset = 'UTF-8';
        s.async = true;
        s.src = ('https:' == w.location.protocol ? 'https' : 'http') + '://w.uptolike.com/widgets/v1/uptolike.js';
        var h = d[g]('body')[0];
        h.appendChild(s);
    }
})(window, document);
</script>
";
    //default html code of widget
    public $htmlCode = "
<div data-background-alpha='0.0' data-orientation='horizontal' data-text-color='000000' data-share-shape='round-rectangle' data-buttons-color='ff9300' data-sn-ids='fb.tw.ok.vk.gp.mr.' data-counter-background-color='ffffff' data-share-counter-size='11' data-share-size='30' data-background-color='ededed' data-share-counter-type='common' data-pid data-counter-background-alpha='1.0' data-share-style='1' data-mode='share' data-following-enable='false' data-like-text-enable='false' data-selection-enable='true' data-icon-color='ffffff' class='uptolike-buttons'>
</div>
";

    public function widgetCodePrepare($htmlCode) {
        $data_pid = 'cms' . str_replace('.', '', preg_replace('/^www\./', '', $_SERVER['HTTP_HOST']));
        $data_pid = str_replace('-', '', $data_pid);
        $htmlCode = str_replace('data-pid', 'data-pid="' . $data_pid . '"', $htmlCode);
        return $htmlCode;
    }

    public function onContentPrepare($context, &$article, &$params, $page = 0) {
        // echo 'test message';
        $this->componentView = JRequest::getCmd("view");
        //echo '<!--';print_r($article);echo '-->';
        if (isset($article->id)) {

            //echo $article->id;
            $allowContext = array();
            $allowContext[] = 'com_content.article';
            $on_main = $this->params->get('showInFrontPage');

            $allowContext[] = 'com_content.category';
            $allowContext[] = 'com_content.featured';

            $sharePos = $this->params->get('widget_position');

            $option = JRequest::getCmd('option');

            if (!isset($article->catid)) {
                $article->catid = '';
            }

            /** Check for selected views, which will display the buttons. **/
            /** If there is a specific set and do not match, return an empty string.**/
            $showInArticles = $this->params->get('showInArticles', 1);
            $showInFrontpage = $this->params->get('showInFrontPage', 1);

            if (!$showInArticles && ($this->componentView == 'article')) {
                return "";
            }

            if (!$showInFrontpage && ($this->componentView == 'featured')) {
                return "";
            }

            // Check for category view
            $showInCategories = $this->params->get('showInCategories');

            if (!$showInCategories && ($this->componentView == 'category')) {
                return;
            }

            if (!isset($article) OR empty($article->id)) {
                return;
            }

            $excludeArticles = $this->params->get('excludeArticles', array());
            if (!empty($excludeArticles)) {
                $excludeArticles = explode(',', $excludeArticles);
                JArrayHelper::toInteger($excludeArticles);
            }

            // Exluded categories
            $excludedCats = $this->params->get('excludeCats', array());
            if (!empty($excludedCats)) {
                $excludedCats = explode(',', $excludedCats);
                JArrayHelper::toInteger($excludedCats);
            }

            // Included Articles
            $includedArticles = $this->params->get('includeArticles', array());
            if (!empty($includedArticles)) {
                $includedArticles = explode(',', $includedArticles);
                JArrayHelper::toInteger($includedArticles);
            }

            if (!in_array($article->id, $includedArticles)) {
                // Check exluded places
                if (in_array($article->id, $excludeArticles) OR in_array($article->catid, $excludedCats)) {
                    return "";
                }
            }

            switch ($option) {
                case 'com_content':
                    include_once JPATH_ROOT . '/components/com_content/helpers/route.php';
                    if (is_null($this->params->get('widget_code'))) {
                        $shares = $this->jsCode . $this->htmlCode;
                    } else $shares = $this->params->get('widget_code');
                    $shares = $this->widgetCodePrepare($shares);
                    $data_url_str = JRoute::_(ContentHelperRoute::getArticleRoute($article->id, $article->catid, $article->language));
                    // $data_url_str = $this->getUrl();
                    // not applicable sinse we need url's of previed article
                    $data_url_str = str_replace(':', '-', $data_url_str);
                    $data_url_str = str_replace('/index.php', '', $data_url_str);
                    $data_url_str = $_SERVER['HTTP_HOST'] . '/index.php' . str_replace('?id=', '', $data_url_str);
                    $protocol = stripos($_SERVER['SERVER_PROTOCOL'], 'https') === true ? 'https://' : 'http://';
                    $data_url_str = $protocol . $data_url_str;
                    $data_url_str = str_replace('/index.php', '', $data_url_str);


                    $shares = str_replace('div data-', 'div data-url="' . $data_url_str . '" data-', $shares);
                    $shares = str_replace('div data-', 'div data-lang="' . $this->params->get('widget_lang') . '" data-', $shares);
                    $shares = str_replace('div data-', 'div style="text-align:' . $this->params->get('widget_align') . '" data-', $shares);
                    $app = JFactory::getApplication();
                    $menu = $app->getMenu();
                    $mainpageArr = array('/index.php/', '/index.php', '/index.html', '/');
                    $current_url = $_SERVER["REQUEST_URI"];
                    if (in_array($current_url, $mainpageArr)) {
                        if ($on_main == '1') {

                            switch ($sharePos) {
                                case "top":
                                    $article->text = $shares . $article->text;
                                    break;
                                case "bottom":
                                    $article->text = $article->text . $shares;
                                    break;
                                case "both":
                                    $article->text = $shares . $article->text . $shares;
                                    break;
                                default:
                                    $article->text = $shares . $article->text . $shares;
                                    break;
                            }
                        }
                    } else {
                        switch ($sharePos) {
                            case "top":
                                $article->text = $shares . $article->text;
                                break;
                            case "bottom":
                                $article->text = $article->text . $shares;
                                break;
                            case "both":
                                $article->text = $shares . $article->text . $shares;
                                break;
                            default:
                                $article->text = $shares . $article->text . $shares;
                                break;
                        }
                    }
                default:
                    break;
            }
        }
    }

}
