/*
[API: Document.execCommand()]
- HTML 문서가 designMode(contentsEditable=true)로 전환되면 문서에서 execCommand 메서드를 사용할 수 있게 되는데,
이것을 활용해서 문서의 편집 가능한 영역을 변경할 수 있다.
- MDN에서는 해당 API를 사용하는 것을 권장하지 않는다. ==> Clipboard API로 대체
- https://developer.mozilla.org/ko/docs/Web/API/Document/execCommand
*/

(function () {
    'use strict';

    // command: 버튼 정보에 대한 객체가 들어있는 Array
    const commands = [
        {
            cmd: 'backColor',
            value: 'blue',
            label: '배경 컬러',
        },
        {
            cmd: 'bold',
            label: '굵기',
        },
        {
            cmd: 'delete',
            label: '삭제',
        },
        {
            cmd: 'fontSize',
            value: '1-7',
            label: '폰트 사이즈',
        },
        {
            cmd: 'foreColor',
            value: 'rgba(0,0,0,.5)',
            label: '폰트 컬러',
        },
        {
            cmd: 'insertImage',
            value: 'http://dummyimage.com/160x90',
            label: '이미지 추가',
        },
        {
            cmd: 'italic',
            label: '기울이기',
        },
        {
            cmd: 'justifyCenter',
            label: '가운데 정렬',
        },
        {
            cmd: 'justifyFull',
            label: '양쪽 정렬',
        },
        {
            cmd: 'justifyLeft',
            label: '좌측 정렬',
        },
        {
            cmd: 'justifyRight',
            label: '우측 정렬',
        },
        {
            cmd: 'selectAll',
            label: '전체 선택',
        },
        {
            cmd: 'underline',
            label: '밑줄',
        },
        {
            cmd: 'undo',
            label: '취소',
        },
    ];
    const get = (target) => {
        return document.querySelector(target);
    }
    
    let commandObject = {} // commands Array를 key-value의 요소들을 가진 객체로 바꾸어 저장하기 위한 변수
    const $editButtons = get('.editor-buttons');
    const $showEditorButton = get('.show-editor-button');
    const $showHTMLButton = get('.show-html-button');
    const $editorEdit = get('.editor.edit ');
    const $editorHTML = get('.editor.html');

    // execCommand를 통한 명령 실행
    const doCommand = (commandKey) => {
        const command = commandObject[commandKey];
        // value가 존재할 경우, 사용자로부터 값을 입력 받아야 함.
        const val = command.value ? prompt('값을 입력해주세요', command.value) : '';
        document.execCommand(command.cmd, false, val);
    }

    // $editorEdit ==> innerHTML(스타일이 적용되어 표시되도록 함.)
    // $editorHTML ==> innerText(스타일이 단순히 텍스트로 표시되도록 함.)
    const onClickShowEditorButton = () => {
         $editorEdit.innerHTML = $editorHTML.innerText;
         $editorHTML.classList.toggle('show');
         $editorEdit.classList.toggle('show');
    }

    const onClickShowHTMLButton = () => {
        $editorHTML.innerText = $editorEdit.innerHTML;
        $editorHTML.classList.toggle('show');
        $editorEdit.classList.toggle('show');
    }

    const init = () => {
        // 버튼 생성
        commands.map((command) => {
            // commandObject 객체에 command 객체를 command.cmd ==> key, command ==> value 쌍으로 만들어 객체 저장
            commandObject[command.cmd] = command;
            const element = document.createElement('button');
            element.innerText = command.label;
            element.addEventListener('click', (event) => {
                event.preventDefault();
                doCommand(command.cmd);
            });
            $editButtons.appendChild(element);
        });
    }

    $showEditorButton.addEventListener('click', onClickShowEditorButton);
    $showHTMLButton.addEventListener('click', onClickShowHTMLButton);

    init();

})();