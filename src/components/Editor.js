import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import ACTIONS from '../Actions';
import { useParams } from 'react-router-dom';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const Editor = ({ socketRef, onCodeChange }) => {

	const editorRef = useRef(null);
	const { roomId } = useParams();

	useEffect(() => {
		async function intit() {
			editorRef.current = Codemirror.fromTextArea(document.getElementById("editorTextarea"), {
					mode: { name: 'javascript', json: true },
					theme: 'dracula',
					autoCloseTags: true,
					autoCloseBrackets: true,
					lineNumbers: true,
			});

			editorRef.current.on('change', ( instance, changes ) => {
				console.log(changes);
				const { origin } = changes;
				const code = instance.getValue();
				onCodeChange(code);
				if(origin !== 'setValue') {
					socketRef.current.emit(ACTIONS.CODE_CHANGE, {
						code,
						roomId,
					})
				}
			});
		}
		intit();
	}, []);

	useEffect(() => {
		if(socketRef.current) {
			socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
				if(code !== null)
					editorRef.current.setValue(code);
			})
		}
	}, [socketRef.current]);

  return (
    <textarea id='editorTextarea'></textarea>
  )
}

export default Editor;