/* 以下是課程管理頁面的 JavaScript 程式碼（與原本 courseDashboard.html 中的內容相同）
※ 建議將這些共用函式（例如 renderList、syncData 等）抽出成共用檔案，
或至少確保載入後只執行一次初始化。
*/
let items = [];  // 存放課程資料

async function initCourseDashboard() {
    try {
    console.log("CourseDashboard: LIFF 已初始化");
    document.getElementById("help-link").addEventListener("click", showHelpView);
    document.getElementById("back-link").addEventListener("click", showIndexView);        
    } catch (err) {
    console.error("課程管理頁面初始化錯誤", err);
    }
    renderList(items);
    syncData();
}

async function syncData() {
    const newData = await fetchItems();
    updateList(newData);
}

async function fetchItems() {
    try {
    const response = await fetch("https://ozt1li4e01.execute-api.ap-northeast-3.amazonaws.com/prod/");
    const data = await response.json();
    console.log("取得資料成功");
    return data;
    } catch (err) {
    console.error("取得資料錯誤", err);
    return [];
    }
}

function sortData(data) {
    return data.sort((a, b) => {
    const dayA = parseInt(a.WEEK_DAY, 10);
    const dayB = parseInt(b.WEEK_DAY, 10);
    if (dayA !== dayB) {
        return dayA - dayB;
    } else {
        const numA = parseInt(a.BATCH.replace('L', ''), 10);
        const numB = parseInt(b.BATCH.replace('L', ''), 10);
        return numA - numB;
    }
    });
}

function renderList(data) {
    const sortedData = sortData(data);
    const listContainer = document.getElementById("schedule-list");

    sortedData.forEach(item => {
    if (!document.getElementById(`card-${item.PK}`)) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.id = `card-${item.PK}`;

        card.innerHTML = `
        <div class="card-header">
            <span class="week-day">星期 ${item.WEEK_DAY}</span>
            <span class="batch">梯次 ${item.BATCH}</span>
        </div>
        <div class="card-body">
            <p>課號: <strong>${item.PK}</strong></p>
            <p>狀態: <span id="status-${item.PK}" class="${item.IS_OPEN ? 'open' : 'closed'}">
            ${item.IS_OPEN ? "開啟" : "關閉"}
            </span></p>
            <div class="button-group">
            <button id="toggle-btn-${item.PK}" class="toggle-btn">
                ${item.IS_OPEN ? "關閉梯次" : "開啟梯次"}
            </button>
            <button class="refresh-btn" onclick="sendLiffMessage('梯次刷新 ${item.PK}')">
                梯次刷新
            </button>
            </div>
        </div>
        `;

        const toggleBtn = card.querySelector(`#toggle-btn-${item.PK}`);
        toggleBtn.addEventListener("click", () => {
        toggleStatus(item.PK);
        });

        listContainer.appendChild(card);
    }
    });
}

function updateList(newData) {
    const newItemsMap = new Map(newData.map(item => [item.PK, item]));

    newItemsMap.forEach((newItem, pk) => {
    const oldItem = items.find(i => i.PK === pk);
    if (!oldItem) {
        renderList([newItem]);
    } else if (oldItem.IS_OPEN !== newItem.IS_OPEN) {
        document.getElementById(`status-${pk}`).textContent = newItem.IS_OPEN ? "開啟" : "關閉";
        document.getElementById(`status-${pk}`).className = newItem.IS_OPEN ? "open" : "closed";
        document.getElementById(`toggle-btn-${pk}`).textContent = newItem.IS_OPEN ? "關閉梯次" : "開啟梯次";
    }
    });

    items = newData;
    reorderDomElements();
}

function reorderDomElements() {
    const sortedData = sortData(items);
    const listContainer = document.getElementById("schedule-list");
    sortedData.forEach(item => {
    const card = document.getElementById(`card-${item.PK}`);
    if (card) {
        listContainer.appendChild(card);
    }
    });
}

function toggleStatus(pk) {
    const item = items.find(i => i.PK === pk);
    if (!item) return;
    item.IS_OPEN = !item.IS_OPEN;
    document.getElementById(`status-${pk}`).textContent = item.IS_OPEN ? "開啟" : "關閉";
    document.getElementById(`status-${pk}`).className = item.IS_OPEN ? "open" : "closed";
    document.getElementById(`toggle-btn-${pk}`).textContent = item.IS_OPEN ? "關閉梯次" : "開啟梯次";
    sendLiffMessage(`梯次狀態 ${item.IS_OPEN ? "開啟" : "關閉"} ${pk}`);
}

async function sendLiffMessage(messageText) {
    try {
    await liff.sendMessages([{ type: 'text', text: messageText }]);
    } catch (err) {
    console.error("sendMessages error", err);
    alert("傳送失敗，請確認在 LINE in-app browser 開啟");
    }
}

function showHelpView() {
    document.getElementById("courseDashboard-view").style.display = "none";
    document.getElementById("help-view").style.display = "block";
}

function showIndexView() {
    document.getElementById("help-view").style.display = "none";
    document.getElementById("courseDashboard-view").style.display = "block";
}

// window.addEventListener("load", initCourseDashboard);

