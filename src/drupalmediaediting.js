import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import TemplateEditing from '@amazee/ckeditor5-template/src/templateediting';

import { downcastAttributeToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { downcastTemplateElement, getModelAttributes } from '@amazee/ckeditor5-template/src/utils/conversion';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import { postfixTemplateElement } from '@amazee/ckeditor5-template/src/utils/integrity';

/**
 * Drupal media integration for CKEditor templates.
 */
export default class DrupalMediaEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		editor.config.define( 'drupalMediaSelector', () => '' );
		editor.config.define( 'drupalMediaRenderer', () => '' );
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ TemplateEditing ];
	}

	init() {
		this._mediaRenderer = this.editor.config.get( 'drupalMediaRenderer' ).callback;

		this.editor.templates.registerPostFixer( [ 'drupal-media' ], postfixTemplateElement );

		this.editor.conversion.for( 'editingDowncast' ).add( downcastAttributeToAttribute( {
			model: 'data-media-uuid',
			view: 'data-media-uuid',
		} ) );

		this.editor.conversion.for( 'editingDowncast' ).add( downcastAttributeToAttribute( {
			model: 'data-entity-uuid',
			view: 'data-entity-uuid',
		} ) );

		// Default editing downcast conversions for template container elements without functionality.
		this.editor.conversion.for( 'editingDowncast' ).add( downcastTemplateElement( this.editor, {
			types: [ 'drupal-media' ],
			view: ( templateElement, modelElement, viewWriter ) => {
				const container = viewWriter.createContainerElement(
					'ck-media',
					getModelAttributes( templateElement, modelElement )
				);
				return toWidget( container, viewWriter );
			}
		} ), { priority: 'low ' } );
	}
}
