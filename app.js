// app.js

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import TextWatcher from '@ckeditor/ckeditor5-typing/src/textwatcher';
import Placeholder from './placeholder/placeholder';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import View from '@ckeditor/ckeditor5-engine/src/view/view'

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic, Placeholder],
        toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList','|', 'placeholder'  ],
        placeholderConfig: {
            types: [ 'date', 'color', 'first name', 'surname' ]                        
        }
    } )
    .then( editor => {
        console.log( 'Editor was initialized', editor );
        CKEditorInspector.attach( 'editor', editor );
        // Expose for playing in the console.
        window.editor = editor;

        let testCallback = (text) => {return text.match(/:[A-Za-z0-9]*$/)};
        const watcher = new TextWatcher(editor.model, testCallback);
        watcher.on('matched:data', (event, data) => {
            let tag = data[0];
            let match = editor.config.get('placeholderConfig.types').find(ele => tag.match(new RegExp(':' + ele)))
            if (match){
                editor.execute( 'placeholder', { value: match } );
                editor.model.change( writer => {   
                    data.range.start = data.range.start.getShiftedBy(data.index)
                    writer.remove(data.range);  
                } );
            }
        });
        

    } )
    .catch( error => {
        console.error( error.stack );
    } );