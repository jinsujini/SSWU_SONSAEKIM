document.addEventListener('DOMContentLoaded', () => {
    const bookmarkBtn = document.getElementById("bookmark-btn");
    const img = document.getElementById("btn-img");

    if (!bookmarkBtn || !img) return;

    bookmarkBtn.addEventListener('click', async () => {
        const sourceId = bookmarkBtn.dataset.sourceId || bookmarkBtn.dataset.wordId;
        const sourceType = bookmarkBtn.dataset.sourceType;

        try {
            const res = await fetch('/quiz/bookmark/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sourceId, sourceType })
            });

            const result = await res.json();

            if (res.ok) {
                if (result.status === 'added') {
                    img.src = '/assets/filled_bookmark.svg';
                } else if (result.status === 'removed') {
                    img.src = '/assets/empty_bookmark.svg';
                }
            } else {
                alert(`북마크 처리 실패: ${result.message}`);
            }
        } catch (err) {
            alert('서버 오류 발생');
            console.error(err);
        }
    });
});

