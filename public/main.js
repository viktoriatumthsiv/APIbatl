
async function load() {
    const r = await fetch('/dates');
    const data = await r.json();
    document.getElementById('list').innerHTML = data.map(d => `
        <div class="date-card">
            <b>${d.date}</b>: ${d.title} <br>
            <small>✨ ${d.funFact}</small>
            <button class="delete-btn" onclick="deleteDate('${d.id}')">Видалити</button>
        </div>
    `).join('');
}

async function deleteDate(id) {
    if (confirm("Видалити цю подію?")) {
        await fetch(`/dates/${id}`, { method: 'DELETE' });
        load(); // Оновлюємо список після видалення
    }
}
async function addDate() {
    const body = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        funFact: document.getElementById('funFact').value,
        reminder: true
    };
    await fetch('/dates', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
    load();
}
load();