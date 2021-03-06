// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach(function (el) {
    el.addEventListener('click', () => {
        const id = el.querySelector('td').textContent;
        getComment(id);
    });
});

// 사용자 로딩
function getUser() {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            const users = JSON.parse(xhr.responseText);
            console.log(users);
            const tbody = document.querySelector('#user-list tbody');
            tbody.innerHTML = '';
            users.map(function (user) {
                const row = document.createElement('tr');
                row.addEventListener('click', () => {
                    getComment(user.id);
                });
                let td = document.createElement('td');
                td.textContent = user.id;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.name;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.age;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.married ? '기혼' : '미혼';
                row.appendChild(td);
                tbody.appendChild(row);
            });
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('GET', '/users');
    xhr.send();
}

// 댓글 로딩
function getComment(id) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            const comments = JSON.parse(xhr.responseText);
            const tbody = document.querySelector('#comment-list tbody');
            tbody.innerHTML = '';
            comments.map(function (comment) {
                const row = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = comment.id;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = comment.user.name;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = comment.comment;
                row.appendChild(td);


                const edit = document.createElement('button');
                edit.textContent = '수정';
                edit.addEventListener('click', () => { // 수정 클릭 시
                    const newComment = prompt('바꿀 내용을 입력하세요');
                    if (!newComment) {
                        return alert('내용을 반드시 입력하셔야 합니다');
                    }
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () =>{
                        if (xhr.status === 200) {
                            console.log(xhr.responseText);
                            getComment(id);
                        } else {
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('PATCH', '/comments/' + comment.id);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({comment: newComment}));
                });


                const remove = document.createElement('button');
                remove.textContent = '삭제';
                remove.addEventListener('click', () => { // 삭제 클릭 시
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            console.log(xhr.responseText);
                            getComment(id);
                        } else {
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('DELETE', '/comments/' + comment.id);
                    xhr.send();
                });


                td = document.createElement('td');
                td.appendChild(edit);
                row.appendChild(td);
                td = document.createElement('td');
                td.appendChild(remove);
                row.appendChild(td);
                tbody.appendChild(row);
            });
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('GET', '/comments/' + id);
    xhr.send();
}

// 사용자 등록 시
document.getElementById('user-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = e.target.username.value;
    const age = e.target.age.value;
    const married = e.target.married.checked;
    if (!name) {
        return alert('이름을 입력하세요');
    }
    if (!age) {
        return alert('나이를 입력하세요');
    }
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 201) {
            console.log(xhr.responseText);
            getUser();
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST', '/users');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({name: name, age: age, married: married}));
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
});
// 댓글 등록 시
document.getElementById('comment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if (!id) {
        return alert('아이디를 입력하세요');
    }
    if (!comment) {
        return alert('댓글을 입력하세요');
    }
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 201) {
            console.log(xhr.responseText);
            getComment(id);
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST', '/comments');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({id: id, comment: comment}));
    e.target.userid.value = '';
    e.target.comment.value = '';
});
