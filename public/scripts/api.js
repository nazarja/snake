
export const sendScores = data => {
    fetch('/api/saveScore', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .catch(err => console.log(err));
};