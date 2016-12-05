/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
  config.extraPlugins = 'fakeobjects,popup,widget,lineutils,filebrowser,image2,notification,notificationaggregator,embedbase,embed,autolink,autoembed,spoiler,slideshow,table,tabletools,tableresize';
  config.removePlugins = 'flash';
  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_P;
};
